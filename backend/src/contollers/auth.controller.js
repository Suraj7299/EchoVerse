import{User} from '../models/user.model.js';

export const authCallback=async(req,res)=>{
  try{
    const{id,firstName,lastName,imageUrl}=req.body;
    const user=await User.findOne({clerkId:id});
    if(!user){
      await User.create({
        clerkId:id,
        fullNmae:`${firstName} ${lastName}`,
        image:imageUrl
      })
    }
    res.status(200).json({message:"User created successfully"});
  }
  catch(error){
    console.log("error in auth callback",error);
    res.status(500).json({message:"Internal server error",error});
  }
};