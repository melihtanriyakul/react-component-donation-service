import React, {Component} from 'react';
import DonationBar from './DonationBar';
import './DonationPage.css'


class DonationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stops: [],
            donationRaised: 0,
            currentDonation: 0,
            completedPercentage: 0,
            selectedStopId: -1,
            showAllClicked: false,
            fields: {
                amount: true,
                name: true,
                nameOnCard: true,
                creditCartNumber: true,
                month: true,
                year: true,
                cvv: true
            }
        };

        this.allStops = [];
        /** Flags defined for error handling.*/
        this.stopsLoaded = false;
        this.donationDone = false;

        /** Declaring refs*/
        this.searchBar = React.createRef();
        this.stopList = React.createRef();
        this.donationContainer = React.createRef();
        this.selectedStop = React.createRef();
        this.amountInput = React.createRef();
        this.nameInput = React.createRef();
        this.nameOnCardInput = React.createRef();
        this.creditCartNumberInput = React.createRef();
        this.monthInput = React.createRef();
        this.yearInput = React.createRef();
        this.cvvInput = React.createRef();
    }

    /**
     * Loads the bus stops from BusStopService into
     * an attribute of this component and if any error
     * occurs it tries to load again.
     * */
    componentDidMount() {
        while (!this.stopsLoaded) {
            try {
                this.allStops = this.props.busStopService.getAllStops();
                this.setState({stops: this.allStops});
                this.stopsLoaded = true;
            } catch (e) {
                console.log(e);
            }
        }

    }

    /**
     * Filters the bus stops with respect to the given
     * input and updates the bus stops in the state accordingly.
     * */
    filterStops = (e) => {
        if (e.target.value !== "") {
            let filteredStops = this.allStops.filter(city => city.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
            this.stopList.current.className = "list-group show";
            this.setState({stops: filteredStops});
        } else {
            this.stopList.current.className = "list-group hide";
            this.setState({stops: this.allStops});
        }
    };

    /**
     * Calculates the current donation and the percentage
     * of completed donation. Values used in the donation
     * bar animation later on.
     * */
    calculateDonation = (e) => {
        if (e.target.value !== "") {
            const currentDonation = parseFloat(e.target.value);
            const percentage = ((this.state.donationRaised + currentDonation) / 700) * 100;
            this.setState({
                currentDonation: currentDonation,
                completedPercentage: percentage
            });
        } else {
            this.setState({
                currentDonation: 0
            });
        }
    };

    /**
     * Handles the click event when one of the bus stops
     * is selected. It activates the donation container
     * which includes the fields like the donation amount,
     * name, cart details etc. It also finds the selected
     * bus stop from the BusStopService and updates the
     * donation bar with the values extracted from the service.
     * */
    handleClick = (e) => {
        this.stopList.current.className = "list-group hide";
        this.searchBar.current.value = "";
        this.selectedStop.current.innerHTML = e.target.innerHTML;
        this.donationContainer.current.className = "donation-container show";

        const id = parseInt(e.target.id);
        let selectedStop = this.allStops.find(function (s) {
            return s.stopId === id;
        });

        const raisedDonation = selectedStop.donationsRaisedInDollars || 0;
        const percentage = (raisedDonation / 700) * 100;

        this.setState({
            showAllClicked: !this.state.showAllClicked,
            selectedStopId: id,
            donationRaised: raisedDonation,
            completedPercentage: percentage
        })
    };

    /**
     * Shows the list of bus stops when the show all stops button is clicked.
     */
    handleShowAll = () => {
        if (this.state.showAllClicked) {
            this.stopList.current.className = "list-group hide";
        } else {
            this.stopList.current.className = "list-group show";
        }

        this.setState({
            stops: this.allStops,
            showAllClicked: !this.state.showAllClicked
        });
    }

    /**
     * Checks if the given input is a number, if it is
     * returns it. It is used for the fields that only
     * contains numbers: credit cart number, CVV code.
     * */
    isNumber = (e) => {
        if (e.charCode > 47 && e.charCode < 58) {
            if (e.target.className.indexOf("cart-number") !== -1 && this.creditCartNumberInput.current.value.length > 18) {
                e.preventDefault();
            } else if (e.target.className.indexOf("cvv") !== -1 && this.cvvInput.current.value.length > 2) {
                e.preventDefault();
            }

            return true;
        } else {
            e.preventDefault();
        }
    };

    /**
     * Checks if the given input is a character, if it is
     * returns it. It is used for the fields that only
     * contains characters: name, name on credit card.
     * */
    isChar = (e) => {
        if (e.charCode > 47 && e.charCode < 58) {
            e.preventDefault();
        } else {
            return true;
        }
    };

    /**
     * Validates all the required fields when the donate
     * button is clicked. If all the validation are done
     * then it adds the donation to the system for the
     * selected stop, if not then it gives error messages
     * for the required fields.
     * */
    validateFields = () => {
        let fields = {...this.state.fields};

        fields.amount = this.amountInput.current.value > 0;
        fields.name = this.nameInput.current.value !== "";
        fields.nameOnCard = this.nameOnCardInput.current.value !== "";
        fields.creditCartNumber = (this.creditCartNumberInput.current.value).length === 20;
        fields.month = this.monthInput.current.value > 0;
        fields.year = this.yearInput.current.value > 0;
        fields.cvv = (this.cvvInput.current.value).length === 3;

        this.setState({fields});

        let isDone = Object.values(fields).reduce((acc, val) => acc && val, true);

        if (isDone) {
            while (!this.donationDone) {
                try {
                    this.props.busStopService.addDonation(this.state.selectedStopId, this.state.currentDonation);
                    this.donationDone = true;
                } catch (e) {
                    console.log(e)
                }
            }
            /** Callback function to terminate the component.*/
            this.props.donate(isDone);
        }
    };

    /**
     * Puts a space between every for digits of the given
     * credit cart number for the sake of readibility.
     * */
    formatCreditCardNumber = () => {
        this.creditCartNumberInput.current.value = this.creditCartNumberInput
            .current.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
    };


    render() {
        const currentTotalDonation = this.state.donationRaised + this.state.currentDonation;
        const currentPercentage = ((this.state.donationRaised + this.state.currentDonation) / 700) * 100;
        let years = [];
        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        for (let i = 19; i < 40; i++) {
            years.push(i);
        }

        return (
            <div className="container">
                <h2>Stop List</h2>
                <p>You can search the stops to donate:</p>
                <input className="form-control searchbar" type="text" ref={this.searchBar} placeholder="Search for a stop"
                       onChange={this.filterStops}/>
                <br/>
                <button type="button" className="btn btn-dark show-all-stops" onClick={this.handleShowAll}>Show All Stops</button>

                <ul className="list-group hide" ref={this.stopList} id="myList">
                    {this.state.stops.map((stop, index) => {
                        const missingDonation = (700 - stop.donationsRaisedInDollars) > 0 ? (700 - stop.donationsRaisedInDollars) : 0;

                        return <li className="list-group-item" key={index} id={stop.stopId}
                            onClick={this.handleClick}>
                            <p id={stop.stopId}>{stop.name}</p>
                            <p id={stop.stopId} style={{float: "right", margin: -30, marginRight: 150}}>Raised: ${stop.donationsRaisedInDollars} - Still 
                            missing: ${missingDonation}</p></li>
                    }
                    )}
                </ul>


                <div className="donation-container hide" ref={this.donationContainer}>
                    <label htmlFor="stop" className="selectedLabel">Selected Stop</label>
                    <p className="form-control" ref={this.selectedStop}/>

                    <DonationBar
                        completedPercentage={currentPercentage}
                        donationRaised={currentTotalDonation}
                    />

                    <label htmlFor="donation-amount">Amount of donation*</label>
                    <input className="form-control amount" type="text" placeholder="Enter the amount"
                           ref={this.amountInput}
                           onKeyPress={this.isNumber} onChange={this.calculateDonation}
                           style={{width: '30%', borderColor: this.state.fields.amount ? "lightgrey" : "red"}}/>
                    <div className="error-message"
                         style={{display: this.state.fields.amount ? "none" : "block"}}>Amount is a required field.
                    </div>

                    <label htmlFor="name">Name*</label>
                    <input className="form-control name" type="text" placeholder="Name" ref={this.nameInput}
                           onKeyPress={this.isChar}
                           style={{width: '30%', borderColor: this.state.fields.name ? "lightgrey" : "red"}}/>
                    <div className="error-message"
                         style={{display: this.state.fields.name ? "none" : "block"}}>Name is a required field.
                    </div>

                    <label htmlFor="email">E-Mail - <i>Optional</i></label>
                    <input className="form-control email" type="text" placeholder="E-Mail"
                           style={{width: '30%'}}/>
                    <br/>

                    <label htmlFor="payment">Payment*</label>
                    <input className="form-control name-on-cart" type="text" placeholder="Name on card"
                           ref={this.nameOnCardInput} onKeyPress={this.isChar}
                           style={{width: '30%', borderColor: this.state.fields.nameOnCard ? "lightgrey" : "red"}}/>
                    <div className="error-message"
                         style={{display: this.state.fields.nameOnCard ? "none" : "block"}}>Name is a required
                        field.
                    </div>

                    <input className="form-control cart-number" type="text" placeholder="Credit/Debit Card Number"
                           ref={this.creditCartNumberInput} onKeyPress={this.isNumber}
                           onChange={this.formatCreditCardNumber}
                           style={{
                               width: '30%',
                               borderColor: this.state.fields.creditCartNumber ? "lightgrey" : "red"
                           }}/>
                    <div className="error-message"
                         style={{display: this.state.fields.creditCartNumber ? "none" : "block"}}>Cart number is a
                        required field.
                    </div>

                    <br/>
                    <div className="exp-container">
                        <div className="expiration-date">
                            <select name='expireMM' id='expireMM' ref={this.monthInput}
                                    style={{borderColor: this.state.fields.month ? "lightgrey" : "red"}}>
                                <option value=''>Month</option>
                                {months.map((month, index) =>
                                    <option key={index} value={month}>{month}</option>
                                )}
                            </select>
                            <select name='expireYY' id='expireYY' ref={this.yearInput}
                                    style={{borderColor: this.state.fields.year ? "lightgrey" : "red"}}>
                                <option value=''>Year</option>
                                {years.map((year, index) =>
                                    <option key={index} value={year}>{2000 + year}</option>
                                )}
                            </select>
                        </div>
                        <div className="error-message"
                             style={{display: this.state.fields.month && this.state.fields.year ? "none" : "block"}}>Expiration
                            Date is a required field.
                        </div>

                        <input className="form-control cvv" type="text" placeholder="CVV" ref={this.cvvInput}
                               onKeyPress={this.isNumber}
                               style={{width: '7%', borderColor: this.state.fields.cvv ? "lightgrey" : "red"}}/>
                        <div className="error-message"
                             style={{display: this.state.fields.cvv ? "none" : "block"}}>CVV number is a
                            required field.
                        </div>

                    </div>
                    <a href="#none" className="donate" onClick={this.validateFields}>DONATE</a>
                </div>
            </div>
        );
    }
}

export default DonationPage;