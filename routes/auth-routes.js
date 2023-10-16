import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {jwtTokens} from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/login', async (req,res) => {
    try {
        const {email,password} = req.body;
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if(users.rows.length === 0) return res.status(401).json({error: "Email is incorrect"})
        // check password
        const validPassword = await bcrypt.compare(password, users.rows[0].password);
        if(!validPassword) return res.status(401).json({error: "Invalid password"});
        // return res.status(200).json("sussess")
        //JWT
        let tokens = jwtTokens(users.rows[0]);
        res.cookie('refresh_token', tokens.refreshToken,{httpOnly:true});
        res.json(tokens);

    } catch (error) {
        res.status(401).json({error: error.message});
    }
});

router.get('/refresh_token', (req,res) => {
    try {
       const refreshToken =  req.cookies.refresh_token;
       if(refreshToken === null) return res.status(401).json({error:'null refresh token'});
       jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if(error) return res.status(403).json({error: error.message})
        let tokens = jwtTokens(user);
         //{httpOnly: true, sameSite: none, secure: true}
        res.cookie('refresh_token', tokens.refreshToken,{httpOnly: true});
        res.json(tokens)
       })
    } catch (error) {
       res.status(401).json({error: error.message});
    }
})

router.delete('/refresh_token', (req,res) => {
    try {
      res.clearCookie('refresh_token');
      return res.status(200).json({message: 'refresh token deleted.'})
    } catch (error) {
        res.status(401).json({error: error.message}); 
    }
})


export default router;


