import React from "react";
import Modal from "./Component/Modal.tsx";
import "./App.css";
import Axios from "axios";
import { ReactComponent as Svg } from './logo.svg';
import Posts from './Component/Posts.tsx'
import Pagination from './Component/Pagination.tsx';

class App extends React.Component {

  state = {
    show: false,
    currentPage: 1,
    postsPerPage: 10,
    customers: [],
    filteredUsers: [],
    q: '',
  };

  showModal = e => {
    this.setState({
      show: !this.state.show
    });
  };

  Search = (event) => {
    const q = event.target.value.toLowerCase();
    this.setState({ q }, () => this.filterList());
    this.setState({currentPage: 1})
  }

  filterList = () => {
    let users = this.state.customers;
    let q = this.state.q;

    users = users.filter(function(user) {
      return user.name.toLowerCase().indexOf(q) != -1; // returns true or false
    });

    this.setState({ filteredUsers: users });
  }

  getCustomers = () => {
    Axios.get("https://spruce-backend.herokuapp.com/").then((response) => {
      this.setState({ customers: response.data, filteredUsers: response.data})
    });
  }

  componentDidMount = () => {
    this.getCustomers()
  }

  sortDate = () => {
    var sortedDate = this.state.customers.sort((a, b) => (new Date(a.date)) - (new Date(b.date)))
    this.setState({customers: sortedDate})
  }

  dateConvert = () => {
    this.state.customers.map(el => {
      var date = new Date(el.date + ' ');
      var options = {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
      var sDay = date.toLocaleDateString("en-US", options);
      el.date = sDay
    })
  }

  sortByType = (type) => {
    if(type === 'Dog Walker') {
      let sorted = this.state.filteredUsers.sort((a, b) => (a.type > b.type) - (a.type < b.type))
      this.setState({customers: sorted})
    } else {
      let sorted = this.state.filteredUsers.sort((a, b) => (a.type < b.type) - (a.type > b.type))
      this.setState({customers: sorted})
    }
  }

  sortBy = (event) => {
    if(event.target.value === 'Date'){
      this.sortDate()
    } else if(event.target.value === 'Dog Walker' || event.target.value === 'HouseKeeper'){
      this.sortByType(event.target.value)
    }
  }


  render() {

    this.dateConvert()


    // Get current posts
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    let currentPosts = this.state.filteredUsers.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => this.setState({currentPage: pageNumber});

    return (
      <div className="App">
        <div className='nav'>
          <div className='svg'><Svg/></div>
        </div>
          <div className='header-container'>
            <div className='bookings'>Bookings</div>
            <button
              className='create-bookings'
              onClick={e => {
                this.showModal(e);
              }}
            >
              {" "}
              Create Booking{" "}
            </button>
          </div>


          <div className='sortBy'>
            <label className='sortByLabel'>Sort By:</label>
            <select id="sortBySelect" onChange={this.sortBy}>
              <option value="">--Please Select Option--</option>
              <option value="Date">Date</option>
              <option value="Dog Walker">DogWalker</option>
              <option value="HouseKeeper">HouseKeeper</option>
            </select>
          </div>

          <label className='searchByLabel'>Search By:</label>
          <input type="text" id="myInput" onChange={this.Search} placeholder="Search for names.." title="Type in a name"></input>

        <Posts posts={currentPosts}  />
        <Pagination
          postsPerPage={this.state.postsPerPage}
          totalPosts={this.state.filteredUsers.length}
          paginate={paginate}
        />
        <Modal
          getCustomers={this.getCustomers}
          onClose={this.showModal}
          show={this.state.show}>
        </Modal>
    </div>
    );
  }
}

export default App;
