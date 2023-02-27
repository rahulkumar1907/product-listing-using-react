const userModel = require("../Model/UserModel");
const productModel = require("../Model/ProductModel");
const jwt = require("jsonwebtoken");

const createProduct = async function (req, res){
    try{
        if(req.body.name==undefined){return res.status(400).send({ Error: "Product name is missing" })}
        if(req.body.price==undefined){return res.status(400).send({ Error: "Product price is missing" })}
        if(req.body.company==undefined){return res.status(400).send({ Error: "Product company is missing" })}
        if(req.body.category==undefined){return res.status(400).send({ Error: "Product category is missing" })}
        if(req.body.userId==undefined){return res.status(400).send({ Error: "Product userId is missing" })}
        let productData=await productModel.create(req.body)
       return res.status(201).send({status:true,data:productData,message:"Product created successfully"  });

    }
    catch(err){
       return res.status(500).send({ Error: "Server not responding", error: err.message });
    }
}

const getProduct=async(req,res)=>{
    try{
let product =await productModel.find({isDeleted: false})
if(!product) {return res.status(404).send({ message: "No Product Found" ,status:false}) }
if(product){return res.status(200).send({ data:product ,status:true})}
}
catch(err){
    return res.status(500).send({ Error: "Server not responding", error: err.message });
}
}
const getProductById=async(req,res)=>{
    try{
        let productId=req.params.productId
let product =await productModel.findOne({_id:productId})
if(!product) {return res.status(404).send({ message: "No Product Found" ,status:false}) }
if(product){return res.status(200).send({ data:product ,status:true})}
}
catch(err){
    return res.status(500).send({ Error: "Server not responding", error: err.message });
}
}
const deleteProduct=async(req,res)=>{
    try{
        let productId = req.params.productId
        // if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: " Invalid productId" })

        //Check product in DB
        let checkedProductId = await productModel.findOne({ _id: productId })
        if (!checkedProductId) return res.status(404).send({ status: false, message: "ProductId not Exist" })
        if(req["userId"]!=checkedProductId.userId){ return res.status(304).send({ status: false, message: "user not authorised to delete product" })}
        const products = await productModel.findOneAndUpdate(
            { _id: productId, isDeleted: false },
            { isDeleted: true,},
            { new: true }
          )
          if (!products) return res.status(404).send({ status: false, message: "product not found" })
      
          return res.status(200).send({
            status: true,
            message: "Product has been deleted successfully",
            data: products,
          })
    }
    catch(err){
        return res.status(500).send({ Error: "Server not responding", error: err.message });
    }
}


const updateProduct=async(req,res)=>{
    try{
        let productId = req.params.productId
        console.log(productId)
        let data=req.body
       
        let checkedProductId = await productModel.findOne({ _id: productId })
       
        if (!checkedProductId) return res.status(404).send({ status: false, message: "ProductId not Exist" })
    
        if(req["userId"]!=checkedProductId.userId){ return res.status(304).send({ status: false, message: "user not authorised to delete product" })}
        const products = await productModel.findOneAndUpdate(
            { _id: productId, },
            data,
            { new: true }
          )
          if (!products) return res.status(404).send({ status: false, message: "product not found" })
        //    console.log(products)
          return res.status(200).send({
            status: true,
            message: "Product has been updated successfully",
            data: products,
          })
    }
    catch(err){
        return res.status(500).send({ Error: "Server not responding", error: err.message });
    }
}

module.exports = { createProduct,getProduct,deleteProduct,updateProduct,getProductById }