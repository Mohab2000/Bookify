import Client from "../config";
import bcrypt from "bcrypt";
import config from "../bcrypt";

export type User = {
  id?: number; // Optional since it's auto-generated
  username: string;
  password: string; // Store the hashed password
  first_name: string; // Optional
  last_name: string; // Optional
  email?: string;
  phone_number?: string; // Optional
  role_id: number;
  created_at?: Date; // Auto-generated
  updated_at?: Date; // Auto-generated
};
export class Users {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * from users";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users ${err}`);
    }
  }
  async updateUserById(updatedUser: User, id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = `
        UPDATE users
        SET 
          email =  COALESCE($1, email),
          first_name =  COALESCE($2, first_name),
          last_name =  COALESCE($3, last_name),
          phone_number =  COALESCE($4, phone_number),
          role_id = COALESCE($5, role_id),
          password = COALESCE($6, password),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *`;
      const hashedPassword = bcrypt.hashSync(
        `${updatedUser.password}${config.pepper}`,
        parseInt(config.salt as string, 10)
      );
      const result = await conn.query(sql, [
        updatedUser.email || null,
        updatedUser.first_name,
        updatedUser.last_name,
        updatedUser.phone_number || null,
        updatedUser.role_id,
        hashedPassword,
        id,
      ]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`User with ID ${id} not found.`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update user with ID ${id}. Error: ${err}`);
    }
  }

  async showUserById(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * from users WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release;
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get user with this id ${err}`);
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = `
        INSERT INTO users (username, password, first_name, last_name, email, phone_number, role_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;

      const hashedPassword = bcrypt.hashSync(
        `${user.password}${config.pepper}`,
        parseInt(config.salt as string, 10)
      );

      const result = await conn.query(sql, [
        user.username,
        hashedPassword,
        user.first_name,
        user.last_name,
        user.email || null, // Set to NULL if not provided
        user.phone_number || null, // Set to NULL if not provided
        user.role_id,
      ]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create user: ${err}`);
    }
  }
  async deleteUserById(id: string): Promise<User | null> {
    try {
      const conn = await Client.connect();
      // Use RETURNING * to get the deleted record
      const sql = "DELETE FROM users WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [id]);
      conn.release();

      // If no rows were deleted, return null
      if (result.rows.length === 0) {
        return null; // No role found to delete
      }

      // Return the deleted role (it will contain the deleted row's data)
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete user with id: ${id}. ${err}`);
    }
  }
  async authenticateUser(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT password FROM users WHERE username = ($1)";
      const result = await conn.query(sql, [username]);

      if (result.rows.length) {
        const { password: hashedPassword } = result.rows[0];
        const passwordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashedPassword
        );

        if (!passwordValid) {
          conn.release();
          return null;
        }

        // Retrieve all user details after password validation
        const query = `
          SELECT id, username, first_name, last_name, email, phone_number, role_id, created_at, updated_at 
          FROM users 
          WHERE username = ($1)
        `;
        const userInfo = await conn.query(query, [username]);

        conn.release();
        return userInfo.rows[0]; // Return all user data (including username and other details)
      }
      conn.release();
      return null;
    } catch (error) {
      throw new Error(`Unable to login, unauthenticated user: ${error}`);
    }
  }
}
