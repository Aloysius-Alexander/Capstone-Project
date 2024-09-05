import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
import Movie from "../models/movieModel.js";
import { generateToken } from "../utils/generateToken.js";
import authenticateUser from "../middlewares/userMiddleware.js";



const userRouter = express.Router();



userRouter.post("/SignUp", async (req, res) => {
    
        try {
          const { firstName, lastName, email, password } = req.body
          console.log(email);
       
          const userExist = await User.findOne({ email });
          
          
          if (userExist) {
            return res.send("User already exist");
          }
          
          const saltRounds = 10;
          const hashPassword = await bcrypt.hash(password, saltRounds);
      
          const newUser = new User({
            
             firstName,
             lastName,
             email,
             hashPassword
          });
          
          const newUserCreated = await newUser.save();
      
          if (!newUserCreated) {
            return res.send("User not created");
          }
      
          const token = generateToken(email);
          
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
          res.send("Signed Up successfully!");
        } catch (error) {
          console.log(error, "Something went wrong");
          res.status(500).send("Internal Server Error");
        }
});
 

userRouter.post("/SignIn", async (req, res) => {
      
    try {
          const body = req.body;
          const { email, password } = body;
      
          const user = await User.findOne({ email });
      
        if (!user) {
            return res.send("User not found");
        }
      
            const matchPassword = await bcrypt.compare(
                password,
                user.hashPassword
            );
      
            if (!matchPassword) {
                return res.send("Password is incorrect");
            }
      
        const token = generateToken(email);
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        
            res.send("Logged In!");

        } catch (error) {
          console.log(error, "Something went wrong");
          res.status(500).send("Internal Server Error");
        }
      
});



userRouter.get("/home", async (req, res) => {
    const movies = await Movie.find();
    res.send( movies );
});


userRouter.get("/movies/:id", async (req, res) => {
    try {
    
        const id = req.params.id;
        const movie = await Movie.findById(id);

        if (!movie) {
            res.status(404).send({ message: "Movie not Found" });
        } else {
            res.status(200).send(movie);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message })
    }

});

    
userRouter.get("/bio", authenticateUser, async (req, res) => {
   
    try {
        if (!req.user) {
            return res.status(401).send({ message: " Middleware authentication error" });
        }
        
        const userData = req.user;

        const user = await User.findOne({ email: userData.data });

    
  
        if (!user) {
           return res.json({ message: "User not found"});
         }
         
          
         
            const id = user._id;
            
            
           const reviewCount = await Review.countDocuments({userId: id});
           const reviews = await Review.find({ userId: id }).populate('movieId', 'title');
           res.status(200).send({ user, reviews, reviewCount });

        } catch (error) {
            console.error(error.message);
            res.status(500).send({ message: error.message })
        }
});
    

userRouter.post("/add-review", authenticateUser, async (req, res) => {

 
    try {
        if (!req.user) {
            return res.status(401).send({ message: " Middleware authentication error" });
        }
        
        const userData = req.user;

        const user = await User.findOne({ email: userData.data });

    
  
        if (!user) {
           return res.json({ message: "User not found"});
         }



            const { movieId, rating, content } = req.body;
            const userName = user.firstName;
            const userId = user._id;
          
            const movie = await Movie.findById(movieId);

            if (!movie) {
                return res.send({ message: 'Movie not found' });
          }
          
    
            if (!rating || !content) {
                    return res.status(400).send({ message: "Ensure your rating and review" });
                } else {
                    const createReview = new Review({
                        movieId,
                        userId,
                        userName,
                        rating,
                        content
                    });
                
                  const newReviewCreated = await createReview.save();

                    if (!newReviewCreated) {
                        return res.send("Review not updated");
                    }
                
                    const reviews = await Review.find({ movieId });


                        const totalRating = reviews.reduce((acc, review) =>
                           acc + review.rating, 0);
                        
                        
                        const averageRating = (totalRating / (reviews.length)).toFixed(1);

                        movie.averageRating = averageRating;
                
                        const ratingUpdated = await movie.save();
                
                if (!ratingUpdated) {
                        
                        return res.send({ message: "Rating not updated" });
                    }

                       return res.send("Review updated");
                    
                }
            
        } catch (error) {
            console.error(error.message);
            res.status(500).send({ message: error.message })
        }
});
    



userRouter.get("/movies/:id/get-reviews", async (req, res) => {
  
  
    try {
           
            const movieId = req.params.id;
            const reviews = await Review.find({ movieId: movieId });
    
            if (!reviews) {
                res.status(404).send({ message: "No reviews yet" });
            } else {
                res.status(200).send(reviews);
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send({ message: error.message })
        }
    
});



userRouter.get("/check-user", authenticateUser, async (req, res) => {
   
    const user = req.user;

    if (!user) {
        return res.json({ message: "Middleware authentication error" });
      }
    
    console.log('data', user.data);

    const findUser = await User.findOne({ email: user.data });

    
  
   if (!findUser) {
      return res.json({ message: "Authentication failed", success: false });
    }
    
    res.json({ message: "Authenticate User", success: true });
  });





export default userRouter;