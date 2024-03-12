import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiRespopnse.js'

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend

    const { fullname, email, username, password } = req.body
    // console.log(email)
    // validation - not empty
    // if(fullname==="") {
    //     throw new ApiError(400, "fullname is required")
    // }

    if ([fullname, email, username, password].some((feild) => feild?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists - username, email

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username are already exists");
    }
    // check for images, check for avtar

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    // upload them to cloudinary, avtar

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // create user object - create entry in db

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // remove password and refresh token field from response (above)

    // check for user creation

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering he user")
    }
    // return res

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export { registerUser }