import Client from "../config";

export type Role = {
  id?: string;
  role_name: string;
};

export class Roles {
  async index(): Promise<Role[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM roles";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get roles ${err}`);
    }
  }
  async updateRoleById(updatedRole: Role, id: string): Promise<Role> {
    try {
      const conn = await Client.connect();
      const sql = "UPDATE roles SET role_name = ($1) WHERE id=($2) RETURNING *";
      const result = await conn.query(sql, [updatedRole.role_name, id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update role ${err}`);
    }
  }

  async showRoleById(id: string): Promise<Role> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * from roles WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get role with this id ${err}`);
    }
  }

  async createRole(role: Role): Promise<Role> {
    try {
      const conn = await Client.connect();
      const sql = "INSERT INTO roles (role_name) VALUES($1) RETURNING *";
      const result = await conn.query(sql, [role.role_name]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not insert role ${err}`);
    }
  }
  async deleteRoleById(id: string): Promise<Role | null> {
    try {
      const conn = await Client.connect();
      // Use RETURNING * to get the deleted record
      const sql = "DELETE FROM roles WHERE id=($1) RETURNING *";
      const result = await conn.query(sql, [id]);
      conn.release();

      // If no rows were deleted, return null
      if (result.rows.length === 0) {
        return null; // No role found to delete
      }

      // Return the deleted role (it will contain the deleted row's data)
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete role with id: ${id}. ${err}`);
    }
  }
}
