import axios from 'axios';

async function connectionTest() {
  const result = await axios.get('http://localhost:4567/connection/1');
  if (result.status < 400) {
    if (result.data !== '') {
      console.log(result.data)
    } else {
      console.log('###')
    }
  }
  await connectionTest()
}

connectionTest();
