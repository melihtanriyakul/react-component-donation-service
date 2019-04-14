import React, {Component} from 'react';
import './ThankYouPage.css';

class ThankYouPage extends Component {
    handleClick = () => {
        this.props.donate(false);
    }

    render() {
        return (
            <div className="thankyou-container">
                <header className="header" id="header">
                    <h1 className="title" data-lead-id="site-header-title">THANK YOU!</h1>
                </header>

                <div className="main-content">
                    <p className="main-content-body">Thanks a lot for making this donation.
                        With your support we will be able to improve our public transportation infrastructure.
                        It means a lot to us, just like you do! We really appreciate you giving us your support
                        and a moment of your time today.</p>
                </div>
                <a href="#none" className="donate" onClick={this.handleClick}>DONATE AGAIN</a>
            </div>
        )
    }
}
export default ThankYouPage;