
class Swiper extends React.Component {

  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);

    this.state = {
      currentPage: 1,
    };

    this.pageWidth = 300;
    this.totalPage = this.props.list.length;
  }

  handleClick(e) {
    this.props.callback(e.target.id);
  }

  previous() {
    if (this.state.currentPage > 1) {
      this.state.currentPage--;
      this.list.style.transform = `translateX(${(this.state.currentPage-1) * this.pageWidth * -1}px)`;
    }
  }

  next() {
    if (this.state.currentPage < this.totalPage) {
      this.state.currentPage++;
      this.list.style.transform = `translateX(${(this.state.currentPage-1) * this.pageWidth * -1}px)`;
    }
  }

  render() {

    var lis = this.props.list.map(item => {
      return (
        <li key={item.id} id={item.id} onClick={this.handleClick}>{item.title}</li>
      );
    });

    return (
      <div className="container">
        <a className="previous" onClick={this.previous}>上一页</a>
        <a className="next" onClick={this.next}>下一页</a>
        <div className="list">
          <ul ref={(ul) => { this.list = ul; }} >{lis}</ul>
        </div>
      </div>
    );
  }
}
window.onload = function () {
  var dataList = [
    {
      id: 1,
      title: 'title1',
    },
    {
      id: 2,
      title: 'title2',
    },
    {
      id: 3,
      title: 'title3',
    },
    {
      id: 4,
      title: 'title4',
    },
  ];

  var callbackOutside = function(data) {
    console.log('外部毁掉函数被调用，data：', data);
  }

  ReactDOM.render(
    <Swiper list={dataList} callback={callbackOutside}/>,
    document.getElementById('root')
  );
}