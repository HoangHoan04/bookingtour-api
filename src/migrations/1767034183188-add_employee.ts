import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class AddFullTestData1767034183188 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Khởi tạo ID và Hash password
    const companyId = uuidv4();
    const branchId = uuidv4();
    const deptId = uuidv4();
    const adminId = '00000000-0000-0000-0000-000000000000'; // Giả định ID người tạo là hệ thống
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 2. Tạo Công ty mẫu
    await queryRunner.query(
      `
        INSERT INTO company (id, name, code, "taxCode", address, "createdBy", "isDeleted")
        VALUES ($1, 'Công ty Công nghệ HRM', 'HRM_CORP', '0101234567', 'Hà Nội, Việt Nam', $2, false)
    `,
      [companyId, adminId],
    );

    // 3. Tạo Chi nhánh mẫu
    await queryRunner.query(
      `
        INSERT INTO branch (id, name, code, "companyId", "createdBy", "isDeleted")
        VALUES ($1, 'Chi nhánh Miền Bắc', 'CNMB', $2, $3, false)
    `,
      [branchId, companyId, adminId],
    );

    // 4. Tạo Phòng ban mẫu
    await queryRunner.query(
      `
        INSERT INTO department (id, name, code, "branchId", "companyId", "createdBy", "isDeleted")
        VALUES ($1, 'Phòng Kỹ thuật', 'DEPT_TECH', $2, $3, $4, false)
    `,
      [deptId, branchId, companyId, adminId],
    );

    // --- TẠO CẶP TESTER 01 ---
    const empId1 = uuidv4();
    const userId1 = uuidv4();
    await this.insertEmployee(
      queryRunner,
      empId1,
      'NV001',
      'Nguyễn Văn',
      'Một',
      'tester01@gmail.com',
      companyId,
      branchId,
      deptId,
      adminId,
    );
    await this.insertUser(
      queryRunner,
      userId1,
      'tester01',
      hashedPassword,
      'tester01@gmail.com',
      empId1,
      adminId,
    );

    // --- TẠO CẶP TESTER 02 ---
    const empId2 = uuidv4();
    const userId2 = uuidv4();
    await this.insertEmployee(
      queryRunner,
      empId2,
      'NV002',
      'Trần Thị',
      'Hai',
      'tester02@gmail.com',
      companyId,
      branchId,
      deptId,
      adminId,
    );
    await this.insertUser(
      queryRunner,
      userId2,
      'tester02',
      hashedPassword,
      'tester02@gmail.com',
      empId2,
      adminId,
    );
  }

  private async insertEmployee(
    qr: QueryRunner,
    id: string,
    code: string,
    lastName: string,
    firstName: string,
    email: string,
    cid: string,
    bid: string,
    did: string,
    creator: string,
  ) {
    await qr.query(
      `
        INSERT INTO employee (
            id, code, "lastName", "firstName", "fullName", phone, email, 
            gender, birthday, "identityCard", "placeOfIssuance", "issuanceDate",
            "permanentAddress", "nowAddress", "currentCity", "currentDistrict", "currentWard",
            "bankAccountNumber", "bankName", "bankBranch", "bankAccountHolder",
            "companyId", "branchId", "departmentId", "workingMode", "joinDate",
            "createdBy", "isDeleted"
        ) VALUES (
            $1, $2, $3, $4, $5, '0912345678', $6,
            'MALE', '1995-01-01', 'ID' || floor(random()*1000000)::text, 'CA Hà Nội', NOW(),
            'Hà Nội', 'Hà Nội', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng',
            '123456789', 'Vietcombank', 'Hà Nội', 'TESTER HOLDER', 
            $7, $8, $9, 'FULLTIME', NOW(), $10, false
        )
    `,
      [
        id,
        code,
        lastName,
        firstName,
        `${lastName} ${firstName}`,
        email,
        cid,
        bid,
        did,
        creator,
      ],
    );
  }

  private async insertUser(
    qr: QueryRunner,
    id: string,
    username: string,
    pass: string,
    email: string,
    eid: string,
    creator: string,
  ) {
    await qr.query(
      `
        INSERT INTO users (id, username, password, email, "employeeId", "isActive", "isAdmin", "createdBy", "isDeleted")
        VALUES ($1, $2, $3, $4, $5, true, false, $6, false)
    `,
      [id, username, pass, email, eid, creator],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa dữ liệu mẫu
    await queryRunner.query(
      `DELETE FROM users WHERE username IN ('tester01', 'tester02')`,
    );
    await queryRunner.query(
      `DELETE FROM employee WHERE code IN ('NV001', 'NV002')`,
    );
    await queryRunner.query(`DELETE FROM department WHERE code = 'DEPT_TECH'`);
    await queryRunner.query(`DELETE FROM branch WHERE code = 'CNMB'`);
    await queryRunner.query(`DELETE FROM company WHERE code = 'HRM_CORP'`);
  }
}
