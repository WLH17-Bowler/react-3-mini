import React, { Component } from 'react'
import logo from './mainStreetAuto.svg'
import axios from 'axios'
import './App.css'
import { ToastContainer, toast } from 'react-toastify'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      vehiclesToDisplay: [],
      buyersToDisplay: []
    }
  }
  getVehicles = () => {
    axios.get(`https://joes-autos.herokuapp.com/api/vehicles`).then(response => {
        toast.success('Got all vehicles')
        this.setState({vehiclesToDisplay: response.data})
      }).catch(() => toast.error('Failed to get vehicles'))
  }
  getPotentialBuyers = () => {
    axios.get(`https://joes-autos.herokuapp.com/api/buyers`).then(response => {
        toast.success('Found Buyers')
        this.setState({buyersToDisplay: response.data})
      }).catch(() => toast.error('No current buyers'))
  }
  sellCar = (id) => {
    axios.delete(`https://joes-autos.herokuapp.com/api/vehicles/${id}`).then(response => {
        toast.success('Car was sold')
        this.setState({vehiclesToDisplay: response.data.vehicles})
      }).catch(() => toast.error('Failed to sell car'))
  }
  filterByMake = () => { 
    let make = this.selectedMake.value;
    axios.get(`https://joes-autos.herokuapp.com/api/vehicles?make=${make}`).then(response => {
        toast.success('Found Make')
        this.setState({vehiclesToDisplay: response.data})
      }).catch(() => toast.error('No make found'))
  }
  filterByColor = () => {
    let color = this.selectedColor.value;
    axios.get(`https://joes-autos.herokuapp.com/api/vehicles?color=${color}`)
      .then(response => {
        console.log(response.data)
        toast.success('Color found')
        this.setState({vehiclesToDisplay: response.data})
      }).catch(() => toast.error(`No ${color} car's available`))
  }
  updatePrice = (priceChange, id) => {
    axios.put(`https://joes-autos.herokuapp.com/api/vehicles/${id}/${priceChange}`).then(response => {
        toast.success('Price has been updated')
        this.setState({vehiclesToDisplay: response.data.vehicles})
      }).catch(() => toast.error('Failed to update price'))
  }
  addCar = () => {
    // will need to pass 'newCar' into axios.post() as 2nd argument
    let newCar = {
      make: this.make.value,
      model: this.model.value,
      color: this.color.value,
      year: this.year.value,
      price: this.price.value
    }
    axios.post(`https://joes-autos.herokuapp.com/api/vehicles`, newCar).then(response => {
        toast.success('newCar was added')
        this.setState({vehiclesToDisplay: response.data.vehicles})
      })
      .catch(() => toast.error('Failed to add new car'))
  }
  addBuyer = () => {
    let newBuyer = {
      name: this.name.value,
      phone: this.phone.value,
      address: this.address.value
    }
    axios.post(`https://joes-autos.herokuapp.com/api/buyers`, newBuyer).then(response => {
        toast.success('newBuyer was added')
        this.setState({buyersToDisplay: response.data.buyers})
      }).catch(() => toast.error('Failed to '))
  }
  deleteBuyer = (id) => {
    axios.delete(`https://joes-autos.herokuapp.com/api/vehicles`).then(response => {
        toast.success('Car was removed')
        this.setState({buyersToDisplay: response.data})
      }).catch(() => toast.error('Failed to delete car'))
  }
  nameSearch = () => {
    let searchLetters = this.searchLetters.value;
    axios.get(`https://joes-autos.herokuapp.com/api/buyers?name=${searchLetters}`).then(response => {
        toast.success('Name found')
        this.setState({buyersToDisplay: response.data})
      }).catch(() => toast.error('you broke the thing'))
  }
  byYear = () => {
    let year = this.searchYear.value -1;
    axios.get(`https://joes-autos.herokuapp.com/api/vehicles?year=${year}`)
    .then(response => {
      console.log(response.data)
      console.log(year)
        toast.success('Year found')
        this.setState({vehiclesToDisplay: response.data})
      })
  }
  // Do not edit the code below
  resetData(dataToReset) {
    axios
      .get('https://joes-autos.herokuapp.com/api/' + dataToReset + '/reset')
      .then(res => {
        if (dataToReset === 'vehicles') {
          this.setState({ vehiclesToDisplay: res.data.vehicles });
        } else {
          this.setState({ buyersToDisplay: res.data.buyers });
        }
      });
  }
  // Do not edit the code above

  render() {
    const vehicles = this.state.vehiclesToDisplay.map(v => {
      return (
        <div key={v.id}>
          <p>Make: {v.make}</p>
          <p>Model: {v.model}</p>
          <p>Year: {v.year}</p>
          <p>Color: {v.color}</p>
          <p>Price: {v.price}</p>

          <button
            className="btn btn-sp"
            onClick={() => this.updatePrice('up', v.id)}
          >
            Increase Price
          </button>

          <button
            className="btn btn-sp"
            onClick={() => this.updatePrice('down', v.id)}
          >
            Decrease Price
          </button>

          <button className="btn btn-sp" onClick={() => this.sellCar(v.id)}>
            SOLD!
          </button>

          <hr className="hr" />
        </div>
      );
    });

    const buyers = this.state.buyersToDisplay.map(person => {
      return (
        <div key={person.id}>
          <p>Name: {person.name}</p>
          <p>Phone: {person.phone}</p>
          <p>Address: {person.address}</p>

          <button
            className="btn"
            onClick={() => {
              this.deleteBuyer(person.id);
            }}
          >
            No longer interested
          </button>

          <hr className="hr" />
        </div>
      );
    });

    return (
      <div>
        <ToastContainer />

        <header className="header">
          <img src={logo} alt="" />

          <button
            className="header-btn1 btn"
            onClick={() => this.resetData('vehicles')}
          >
            Reset Vehicles
          </button>

          <button
            className="header-btn2 btn"
            onClick={() => this.resetData('buyers')}
          >
            Reset Buyers
          </button>
        </header>

        <div className="btn-container">
          <button className="btn-sp btn" onClick={this.getVehicles}>
            Get All Vehicles
          </button>

          <select
            onChange={this.filterByMake}
            ref={selectedMake => {
              this.selectedMake = selectedMake;
            }}
            className="btn-sp"
            value=""
          >
            <option value="" disabled>
              Filter by make
            </option>
            <option value="Suzuki">Suzuki</option>
            <option value="GMC">GMC</option>
            <option value="Ford">Ford</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Cadillac">Cadillac</option>
            <option value="Dodge">Dodge</option>
            <option value="Chrysler">Chrysler</option>
          </select>

          <select
            ref={selectedColor => {
              this.selectedColor = selectedColor;
            }}
            onChange={this.filterByColor}
            className="btn-sp"
            value=""
          >
            <option value="" disabled>
              Filter by color
            </option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="Purple">Purple</option>
            <option value="indigo">Indigo</option>
            <option value="violet">Violet</option>
            <option value="teal">Teal</option>
          </select>

          <input
            onChange={this.nameSearch}
            placeholder="Search by name"
            type="text"
            ref={searchLetters => {
              this.searchLetters = searchLetters;
            }}
          />

          <input
            ref={searchYear => {
              this.searchYear = searchYear;
            }}
            className="btn-sp"
            type="number"
            placeholder="Year"
          />

          <button onClick={this.byYear} className="btn-inp"> Go </button>

          <button className="btn-sp btn" onClick={this.getPotentialBuyers}> Get Potential Buyers </button>
        </div>

        <br />

        <p className="form-wrap">
          <input className="btn-sp" placeholder="make" ref={make => {this.make = make;}} />
          <input
            className="btn-sp"
            placeholder="model"
            ref={model => {
              this.model = model;
            }}
          />
          <input
            type="number"
            className="btn-sp"
            placeholder="year"
            ref={year => {
              this.year = year;
            }}
          />
          <input
            className="btn-sp"
            placeholder="color"
            ref={color => {
              this.color = color;
            }}
          />
          <input
            type="number"
            className="btn-sp"
            placeholder="price"
            ref={price => {
              this.price = price;
            }}
          />

          <button className="btn-sp btn" onClick={this.addCar}>
            Add vehicle
          </button>
        </p>

        <p className="form-wrap">
          <input
            className="btn-sp"
            placeholder="name"
            ref={name => {
              this.name = name;
            }}
          />
          <input
            className="btn-sp"
            placeholder="phone"
            ref={phone => {
              this.phone = phone;
            }}
          />
          <input
            className="btn-sp"
            placeholder="address"
            ref={address => {
              this.address = address;
            }}
          />

          <button onClick={this.addBuyer} className="btn-sp btn">
            Add buyer
          </button>
        </p>

        <main className="main-wrapper">
          <section className="info-box">
            <h3>Inventory</h3>

            {vehicles}
          </section>

          <section className="info-box">
            <h3>Potential Buyers</h3>

            {buyers}
          </section>
        </main>
      </div>
    );
  }
}