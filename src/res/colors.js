let now = new Date();
let hrs = now.getHours();
let night = false;
if (hrs >= 19 || hrs <= 6) {
  night = true;
}
const colors = {
  primary: 'orange',
  statusBar: '#000',
  img: '#d2d4d3',
  background: night ? '#1c1c1f' : '#fefefe',
  text: night ? '#969697' : '#5e5a61',
  underlay: night ? '#000' : '#f2f2f7',
  border: night ? '#3f3f43' : 'lightgrey',
};
export default colors;
