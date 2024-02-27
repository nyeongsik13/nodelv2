import express from 'express'
import { prisma } from '../utils/prisma/index.js';


const router = express.Router()

router.post('/reviews/:reviewId/comments',async (req, res, next) => {
    const {reviewId} = req.params
    const{commentContent,author,password} = req.body

    const review = await prisma.reviews.findFirst({
        where: {reviewId: +reviewId}
    })
    if(!review){
        return res.status(400).json({data: "없는 리뷰임"})
    }

    const comment = await prisma.comments.create({
        data:{
            commentContent:commentContent,
            author:author,
            password:password,
        }
    })

    return res.status(201).json({data:comment})
});

router.get('/reviews/:reviewId/comments',async(req,res,next)=>{
    const {reviewId} = req.params
    const review = await prisma.reviews.findFirst({
        where: { reviewId: +reviewId},
    })

    const comment = await prisma.comments.findMany({
        select: {
            commentContent: true,
            author: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return res.status(200).json({comment})
})

export default router


