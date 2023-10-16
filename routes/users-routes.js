import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticationToken } from '../middleware/authorization.js';

const router = express.Router();
router.get("/", async (req,res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json({users: users.rows})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

router.post ('/', authenticationToken, async (req, res) => {
    try {
       const hashedPassword = await bcrypt.hash(req.body.password,10);
       const newUser = await pool.query('INSERT INTO users (picture, first_name, last_name, email, password, role, department, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6,$7, CURRENT_DATE, CURRENT_DATE) RETURNING *',
        [req.body.picture, req.body.first_name, req.body.last_name, req.body.email, hashedPassword ,req.body.role, req.body.department ]);
       res.json({users:newUser.rows[0]})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.delete('/:id', authenticationToken, async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  
      if (deletedUser.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ user: deletedUser.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;