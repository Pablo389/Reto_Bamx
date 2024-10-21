import pool from '../config/db';
import bcrypt from 'bcrypt';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  birth_date: string;
}


export const getAllUsersFromDB = async (): Promise<Omit<User, 'password'>[]> => {
  const query = 'SELECT id, name, email, birth_date FROM users';  
  const result = await pool.query(query);
  return result.rows;
};

export const getUserByIdFromDB = async (id: number): Promise<Omit<User, 'password'> | null> => {
  const query = 'SELECT id, name, email, birth_date FROM users WHERE id = $1';  // Evita SQL Injection con parámetros
  const result = await pool.query(query, [id]);
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null;
  }
};

export const createUser = async (name: string, email: string, password: string, birth_date: string): Promise<User> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query = `
    INSERT INTO users (name, email, password, birth_date) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, birth_date;
  `;
  const result = await pool.query(query, [name, email, hashedPassword, birth_date]);
  return result.rows[0];  // Devolver el usuario creado (sin contraseña)
};