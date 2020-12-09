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
      if(studentcv[index].photo === null) studentcv[index].photo = 'placeholder.jpg'
      const dateTime = new Date(studentcv[index].lastcontact)
      const date = `${dateTime.getDate()}/${dateTime.getMonth()+1}/${dateTime.getFullYear()}`
      studentcv[index].lastcontact = date
    }
    return studentcv
  }
}
export default Studentcv