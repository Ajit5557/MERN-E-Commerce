// import jwt from 'jsonwebtoken'

// const authUser = async (req, res, next) => {
//     const {token} = req.headers;

//     if(!token){
//         return res.json({success: false, message: 'Not Authorized Login Again'})
//     }
//     try {
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET)
//         req.body.userId = token_decode.id
//         next()

//     } catch (error) {
//         console.log(error)
//         res.json({success:false, message:error.message})
//     }
// }

// export default authUser;


// cg
// backend/middleware/auth.js
// import jwt from 'jsonwebtoken'
// const authUser = async (req, res, next) => {
//   const { token } = req.headers;

//   if (!token) {
//     return res.json({ success: false, message: "Not Authorized Login Again" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.id; // ✅ attach to req.user
//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
// export default authUser;



// ------------
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  // read from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Not Authorized, login again" });
  }

  try {
    // Extract the token part by splitting the string
    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach userId
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("❌ authUser error:", error);
    res.status(401).json({ success: false, message: "Unauthorized, please login again" });
  }
};


export default authUser;
