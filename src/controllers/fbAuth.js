const axios = require('axios');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.getFbLoginUrl = async (req, res) => {
    try {
        const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${process.env.REDIRCT_URL}&scope=email`;

        return res.status(200).send({
            code: "Success",
            url,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error occored to get Login URL!', error: error.message });
    }
}

exports.facebookLogin = async (req, res) => {
    const { code } = req.query;
    try {
        const { data } = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${process.env.FB_APP_ID}&client_secret=${process.env.FB_APP_SECRET}&code=${code}&redirect_uri=http://localhost:3000/dashboards/crm/`, {
            params: {
                client_id: process.env.FB_APP_ID,
                client_secret: process.env.FB_APP_SECRET,
                code,
                redirect_uri: process.env.REDIRCT_URL,
            },
        });

        const { access_token } = data;

        const fbUser = await axios.get(`https://graph.facebook.com/v13.0/me`, {
            params: { fields: 'id,name,email', access_token },
        });

        if (!fbUser?.data?.email) {
            return res.status(400).json({ message: 'Email is required from Facebook' });
        }

        let user = await User.findOne({ email: fbUser?.data?.email });

        if (!user) {
            user = new User({
                name: fbUser?.data?.name,
                email: fbUser?.data?.email,
                facebookId: fbUser?.data?.id,
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        await User.findByIdAndUpdate(user?._id, { jwtToken: token })

        res.status(200).json({ message: 'Login Successful', user, token });
    } catch (error) {
        console.error('Error:', error.response?.data?.error || error.message);
        res.status(500).json({ message: 'Facebook Login Failed', error: error });
    }
};


