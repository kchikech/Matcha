export default {
  showAlert (color, text, comp) {
    comp.alert = {
      state: true,
      color,
      text
    }
  },
  passMatch: (p1, p2) => {
    return !p1.length || p2 === p1 ? '' : 'Passwords must match'
  }
}
