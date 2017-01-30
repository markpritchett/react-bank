import React from 'react';

import { Card, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import formatMoney from './formatMoney';

const Account = ({
    id,
    name,
    balance
}) => (
        <Card key={id}>
            <CardTitle title={name} subtitle={`Balance ${formatMoney(balance)}`} />
            <CardActions>
                <FlatButton href={`/accounts/${id}/transactions`} label="View Transactions" primary={true} />
            </CardActions>
        </Card>
    );

export default Account;