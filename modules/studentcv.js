import sqlite from 'sqlite-async'

class Studentcv{
  constructor(dbName = ':memory:') {
    return (async() => {
      this.db = await sqlite.open(dbName)
      const sql = 'CREATE TABLE IF NOT EXISTS studentcv(\
        name TEXT NOT NULL,\
        photo TEXT,\
        summary TEXT,\
        lastcontact INTEGER\
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

  async getByID(id) {
    try{
      const sql = `SELECT * FROM studentcv, users\
          WHERE studentcv.id = ${id};`
      console.log(sql)
      const studentcv = await this.db.get(sql)
      if(studentcv.photo === null) studentcv.photo = 'placeholder.jpg'
      const dateTime = new Date(studentcv.lastcontact * 1000)
      const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
      studentcv.lastcontact = date
      return studentcv
    } catch(err) {
      console.log(err)
      throw err
    }}
}
export default Studentcv