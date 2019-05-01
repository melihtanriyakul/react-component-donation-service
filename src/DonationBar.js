import React, {Component} from 'react';
import './DonationBar.css'

class DonationBar extends Component {
    render() {
        return (
            <div className="donation-container">
                <div className="progress progress-striped active" style={{height: 65, marginTop: 10}}>

                    <p className="alert alert-success raised"><strong>Raised: ${this.props.donationRaised}</strong>
                    </p>

                    <p className="alert alert-success goal"><strong>Still missing:
                        ${this.props.donationNeeded}</strong>
                    </p>

                    <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                         aria-valuemax="100" style={{width: `${this.props.completedPercentage}%`}}>
                    </div>
                </div>
            </div>
        );
    }
}

export default DonationBar;