import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'


class Studentcv {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS studentcv(\
				account INTEGER PRIMARY KEY AUTOINCREMENT,\
        accountid INTEGER,\
        title TEXT NOT NULL,\
				photo TEXT,\
				summary TEXT,\
        qualifications TEXT,\
        skills TEXT,\
				lastcontact INTEGER,\
        FOREIGN KEY(accountid) REFERENCES users(id)\
			);'
			await this.db.run(sql)
			return this
		})()
	}

	async all() {
		const sql = 'SELECT * FROM studentcv'
		const studentcv = await this.db.all(sql)
		for(const index in studentcv) {
			if(studentcv[index].photo === null) studentcv[index].photo = 'avatar.jpg'
			const dateTime = new Date(studentcv[index].lastcontact)
			const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
			studentcv[index].lastcontact = date
		}
		return studentcv
	}
	async add(data) {
		let filename
		if(data.fileName) {
			filename = `${Date.now()}.${mime.extension(data.fileType)}`
			console.log(filename)
			await fs.copy(data.filePath, `public/avatars/${filename}`)
		}
		const timestamp = Math.floor(Date.now())
		try {
			const sql = `INSERT INTO studentcv(accountid, qualifications, skills, summary, title, photo, lastcontact)\
                    VALUES(${data.account},  "${data.qualifications}", "${data.skills}",\
                    "${data.summary}", "${data.title}", "${filename}", ${timestamp})`
			console.log(sql)
			await this.db.run(sql)
			return true
		} catch(err) {
			console.log(err)
			throw err
		}
	}

	async close() {
		await this.db.close
	}

	async getByID(account) {
		try{
			const sql = `SELECT * FROM studentcv, users\
					WHERE studentcv.account = ${account};`
			console.log(sql)
			const studentcv = await this.db.get(sql)
			if(studentcv.photo === null) studentcv.photo = 'avatar.jpg'
			const dateTime = new Date(studentcv.lastcontact)
			const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
			studentcv.lastcontact = date
			return studentcv
		} catch(err) {
			console.log(err)
			throw err
		}
	}
}
export default Studentcv
