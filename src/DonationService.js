import React, {Component} from 'react';
import BusStop from './DonationPage';
import ThankYouPage from './ThankYouPage';
import BusStopService from "./BusStopService";

class DonationService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            donationPage: true,
        }
        this.busStopService = new BusStopService();
    }

    donationDone = (returnValue) => {
        this.setState({donationPage: !returnValue});
    }

    render() {
        let currentPage = "";
        if (this.state.donationPage) {
            currentPage = <BusStop donate={this.donationDone} busStopService = {this.busStopService}/>;
        } else {
            currentPage = <ThankYouPage donate={this.donationDone}/>;
        }
        return (
            <div>
                {currentPage}
            </div>
        );
    }
}

export default DonationService;
