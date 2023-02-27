const userModel = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
let saltRounds = 10

const createUser = async function (req, res) {
  try {
    
    let name = /^[a-zA-Z ]{2,30}$/.test(req.body.name);
    let emailId = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email);
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(req.body.password);

    let user = await userModel.findOne({ email: req.body.email});
    if (req.body.name === undefined  || req.body.email === undefined || req.body.password === undefined ||req.body.phone === undefined) {
      res.status(400).send({ msg: "Invalid request ! Please provide details" })
    }

    else if (!req.body.name) {
      res.status(400).send({ Error: "name is missing" })
    }
    else if (!req.body.email) {
      res.status(400).send({ Error: "Email Id is missing" })
    }
    else if (!req.body.password) {
      res.status(400).send({ Error: "Password is missing" })

    }
    else if (name == false) {
      res.status(400).send({ Error: "Please Enter valid name." });
    }

    else if (emailId == false) {
      res.status(400).send({ Error: "Please Enter valid email." });
    }
    
    else if (password == false) {
      res.status(400).send({
        Error: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
      });
    }
    else if (!user) {
      const encryptPassword = await bcrypt.hash(req.body.password, saltRounds)
      const userData = {
        name: req.body.name,
        email: req.body.email,
        phone:req.body.phone,
        password: encryptPassword,
      }
      
      let dataCreated = await userModel.create(userData);
      res.status(201).send({ data: dataCreated ,message:"Successfully Registered"});
    }
    else if (user) {
      res.status(409).send({ Error: "This email already exist" })
    }
  } catch (err) {
    res.status(500).send({ Error: "Server not responding", error: err.message });
  }
}




const loginUser = async function (req, res) {

  try{
  let email1 = req.body.email;
  let password1 = req.body.password;

  if (!email1) {
    res
      .status(400)
      .send({ status: false, Error: "Please enter an email address." });
  } else if (!password1) {
    res.status(400).send({ status: false, Error: "Please enter Password." });
  } else {
    let user = await userModel.findOne({
      email: email1
    });
    if (!user)
      return res.status(400).send({
        status: false,
        Error: "Email is incorrect",
      });
    // console.log("user",user)
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
    // console.log("error",isPasswordMatch)
    if (!isPasswordMatch) return res.status(401).send({ status: false, message: "Password is Incorrect" })

    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "skyeair",
        organisation: "skyeair",
      },
      "skyeair",
      { expiresIn: "24h" }
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true,message:"login succefully", data: token });
  }
}catch (err) {
    res.status(500).send({ Error: "Server not responding", error: err.message });
  }
};



const profileDetail = async function (req, res) {
// get all user except who is log in
  try{
    const keyToSearch=req.query.email
  //  console.log(keyToSearch)
    const user=await userModel.findOne({email:keyToSearch})
    // console.log(user)
    if(!user){return res.status(404).send({ status: false,message:"Nosuch user exist",  });}
    console.log(JSON.stringify(user._id))
    if(req["userId"]!=user._id){return res.status(304).send({ status: false,message:"You cannot see other user profile",  });}
    if(!user){return res.status(404).send({ status: false,message:"Nosuch user exist",  });}

   return res.status(200).send({ status: true,message:"user deatils", data: user});

  
  }
catch (err) {
    res.status(500).send({ Error: "Server not responding", error: err.message });
  }
};


const profileDetails = async function (req, res) {
  // get all user except who is log in
    try{
     
    //  console.log(keyToSearch)
      const user=await userModel.find()
      // console.log(user)
      
  
     return res.status(200).send({ status: true,message:"user deatils", data: user});
  
    
    }
  catch (err) {
      res.status(500).send({ Error: "Server not responding", error: err.message });
    }
  };




module.exports = { createUser, loginUser,profileDetail,profileDetails }
















