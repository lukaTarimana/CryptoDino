let Charecter = class {
  constructor(name, id, points, stats) {
    this.name = name;
    this.id = id;
    this.points = points;
    this.stats = stats;
  }
  earn() {
    return (this.points += this.stats.earning);
  }
};

export default Charecter;
