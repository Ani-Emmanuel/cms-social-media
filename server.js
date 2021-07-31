const {
	LocalConfig: { PORT }
} = require('./config');
const app = require('./index');

app.listen(PORT || 3000, () => console.log(`We are live on port ${PORT}`));
