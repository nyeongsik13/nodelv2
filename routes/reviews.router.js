import express from 'express';
import { prisma } from '../utils/prisma/index.js';


const router = express.Router()


//리뷰 작성
router.post('/reviews', async(req,res,next)=>{
    const {bookName, reviewTitle, reviewContent, starRating,author,password} = req.body
    const review = await prisma.reviews.create({
        data:{
            bookName: bookName,
            reviewTitle: reviewTitle,
            reviewContent: reviewContent,
            starRating: starRating,
            author: author,
            password: password
        }
    })
    return res.status(201).json({data:review})
})

router.get('/reviews', async(req,res,next)=>{
    const reviews = await prisma.reviews.findMany({
        select:{
            bookName: true,
            reviewTitle: true,
            starRating: true,
            author: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return res.status(200).json({reviews})
})

router.get('/reviews/:reviewId', async(req,res,next)=>{
    const {reviewId} = req.params
    const review = await prisma.reviews.findFirst({
        where: { reviewId: +reviewId},
        select: {
            bookName: true,
            reviewTitle: true,
            reviewContent: true,
            starRating: true,
            author: true,
            createdAt: true,
            updatedAt: true
        }
    })
    return res.status(200).json({review})
})

router.put('/reviews/:reviewId', async(req,res,next)=>{
    const {reviewId} = req.params
    const {bookName,reviewTitle,reviewContent,starRating,password}  = req.body

    const review = await prisma.reviews.findUnique({
        where: {reviewId: +reviewId}
    })

    if (!review)
        return res.status(404).json({ message: '리뷰가 존재하지 않습니다.' });
    else if (review.password !== password)
        return res
            .status(401)
            .json({ message: '비밀번호가 일치하지 않습니다.' });

    await prisma.reviews.update({
        data: {bookName,reviewTitle,reviewContent,starRating},
        where:{
            reviewId: +reviewId,
            password
        }
    })
    
    return res.status(200).json({data:'리뷰가 수정되었습니다.'})
})

router.delete('/reviews/:reviewId', async(req,res,next)=>{
    const {reviewId} = req.params
    const {password} = req.body

    const review = await prisma.reviews.findFirst({where: {reviewId: +reviewId}})

    if (!review)
        return res.status(404).json({ message: '리뷰가 존재하지 않습니다.' });
    else if (review.password !== password)
        return res
            .status(401)
            .json({ message: '비밀번호가 일치하지 않습니다.' });

    await prisma.reviews.delete({where: {reviewId: +reviewId}})
    
    return res.status(200).json({data:'리뷰가 삭제되었습니다.'})
})

export default router