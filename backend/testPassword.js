const mongoose = require('mongoose');
const User = require('./models/User'); // Ajuste o caminho conforme necessário
const bcrypt = require('bcrypt');

async function testPassword() {
    try {
        await mongoose.connect('mongodb://localhost:27017/nomeDoBanco', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const username = 'novo_usuario'; // Nome de usuário a ser testado
        const passwordToTest = 'teste'; // Senha a ser testada

        const user = await User.findOne({ username });
        if (!user) {
            console.log('Usuário não encontrado.');
            return;
        }

        const isMatch = await bcrypt.compare(passwordToTest, user.password);
        if (isMatch) {
            console.log('Senha correta!');
        } else {
            console.log('Senha incorreta.');
        }
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        mongoose.connection.close();
    }
}

testPassword();
