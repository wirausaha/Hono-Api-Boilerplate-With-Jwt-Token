import { exportToCsv } from '../../utils/exporttocsv'
import { getUserWithPagination } from '../../services/userservices'
import { userDtos } from '../../select/userdtos'
import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { generateRandomString } from '../../utils/randomstring'

export const route = new Hono();


route.get('/user/exporttocsv', verifyAccessToken, async (c) => {
    const { filter, start, length } = c.req.query()

    const result = await getUserWithPagination({
        draw: 1,
        start: Number(start ?? 0),
        length: Number(length ?? 100),
        filter: filter ?? ''
    })

    const csv = exportToCsv(result.data, {
        UserId: 'ID',
        UserName: 'Username',
        Email: 'Email',
        FirstName: 'First Name',
        LastName: 'Last Name',
        DateOfBirth: 'DOB',
        Address: 'Address #1',
        Address2: 'Address #2',
        Province: 'Province',
        City: 'City',
        ZipCode: 'Zip',    
        UserRole: 'Role',
        IsActive: 'Active'
        // Tambahkan field lain sesuai kebutuhan
    })

    const filename = generateRandomString(16)

    c.header('Content-Type', 'text/csv')
    c.header('Content-Disposition', `attachment; filename="user-${filename}.csv"`)
    return c.body(csv)
})

export default route