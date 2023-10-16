import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticationToken } from '../middleware/authorization.js'
import multer from 'multer';

//storage config
const imgconfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/users');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: imgconfig});


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

  router.put('/:id', authenticationToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { picture, first_name, last_name, email, role, department } = req.body;

        // Check if the user exists
        const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user
        const updatedUser = await pool.query(
            'UPDATE users SET picture = $1, first_name = $2, last_name = $3, email = $4, role = $5, department = $6, updated_at = CURRENT_DATE WHERE id = $7 RETURNING *',
            [picture, first_name, last_name, email, role, department, id]
        );

        res.json({ user: updatedUser.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;