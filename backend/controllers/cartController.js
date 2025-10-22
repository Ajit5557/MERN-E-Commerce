import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async(req,res) => {
    try {
        const {userId, itemId, size} = req.body

        const userData = await userModel.findById(userId)

        // Check if the user exists
        if (!userData) {
            return res.json({success: false, message: "User not found"})
        }
        let cartData = await userData.cartData;

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1
            }else{
                cartData[itemId][size] = 1
            }
        }else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success: true, message: "Added To Cart"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// update user cart
// const updateCart = async(req,res) => {
//     try {
//         const {userId, itemId, size, quantity} = req.body

//         const userData = await userModel.findById(userId)
//         let cartData = await userData.cartData;

//         cartData[itemId][size] = quantity

//         await userModel.findByIdAndUpdate(userId, {cartData})
//         res.json({success: true, message: "Cart Updated"})
//     } catch (error) {
//         console.log(error)
//         res.json({success:false, message:error.message})
//     }
// }


// const updateCart = async(req,res) => {
//     try {
//         // Get userId from the request object, not the body
//         const userId = req.userId;
//         const {itemId, size, quantity} = req.body;

//         const userData = await userModel.findById(userId);
//         let cartData = await userData.cartData;

//         cartData[itemId][size] = quantity;

//         await userModel.findByIdAndUpdate(userId, {cartData});
//         res.json({success: true, message: "Cart Updated"});
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message});
//     }
// }


const updateCart = async (req, res) => {
  try {
    const userId = req.userId; // comes from auth middleware
    const { itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {}; // ensure it's not null

    // Ensure product entry exists
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (quantity > 0) {
      // Update / Add item
      cartData[itemId][size] = quantity;
    } else {
      // Remove the size from cart
      delete cartData[itemId][size];
      // If product has no sizes left, remove it completely
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// get user cart data
// const getUserCart = async(req,res) => {
//     try {
//         const {userId} = req.body.userId;
//         const userData = await userModel.findById(req.bodyuserId)
//         let cartData = await userData.cartData;

//         res.json({success: true, cartData})
//     } catch (error) {
//         console.log(error)
//         res.json({success:false, message:error.message})
//     }
// }


const getUserCart = async (req, res) => {
  try {
    const userId = req.userId; // now coming from middleware

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error("❌ getUserCart error:", error);
    res.json({ success: false, message: error.message });
  }
};


export {addToCart, updateCart, getUserCart}