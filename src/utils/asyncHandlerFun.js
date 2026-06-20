

// it is a wrapper function which will handle the async function and catch the error and send the response to the client
// it will take a function as an argument and return a function which will be called by the express router


//by using promise chaining
// const asyncHandler = (func) =>{
//     (req,res,next)=>{

//         func(req,res,next)
//         .then(()=>{})
//         .catch((error)=>{
//             res.status(error.code||500).json({
//                 success:false,
//                 message:"Internal server error"
//             });
//     }
// };

//using promise.resolve

const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next))
            .catch((error) => {
                res.status(error.code || 500).json({
                    success: false,
                    message: "Internal server error"
                });
                next(error);
            });
    };
};

//by using try catch block
// const asyncHandler = (func)=>{async(req,res,next)=>{
//     try{
//         await func(req,res,next);
//     }catch(error){
//         res.status(error.code||500).json({
//             success:false,
//             message:"Internal server error"
//         });

//         next(error)
//     }
// }}