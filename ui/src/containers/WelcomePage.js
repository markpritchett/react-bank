import React from 'react';
import { Link } from 'react-router'

const WelcomePage = () => (
    <div>
        <h2>Welcome to React Bank</h2>
        <Link to="/accounts">View Accounts</Link>
    </div>
)

export default WelcomePage