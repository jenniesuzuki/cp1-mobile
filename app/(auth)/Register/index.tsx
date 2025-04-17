import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
} from 'react-native';

export default function Register() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [apelido, setApelido] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');

    const router = useRouter();

    // Função para formatar o CPF enquanto digita
    const formatarCPF = (texto: string) => {
        // Remove todos os caracteres não numéricos
        const numeros = texto.replace(/\D/g, '');

        // Aplica a máscara de CPF (XXX.XXX.XXX-XX)
        let cpfFormatado = numeros;
        if (numeros.length > 3) {
            cpfFormatado = numeros.substring(0, 3) + '.' + numeros.substring(3);
        }
        if (numeros.length > 6) {
            cpfFormatado = cpfFormatado.substring(0, 7) + '.' + numeros.substring(6);
        }
        if (numeros.length > 9) {
            cpfFormatado = cpfFormatado.substring(0, 11) + '-' + numeros.substring(9, 11);
        }

        // Limita a 14 caracteres (XXX.XXX.XXX-XX)
        cpfFormatado = cpfFormatado.substring(0, 14);

        setCpf(cpfFormatado);
    };

    // Validação e envio do formulário
    const handleCadastro = async () => {
        try {
            // Validação básica dos campos
            if (!nome || !cpf || !apelido || !senha || !confirmaSenha) {
                Alert.alert('Erro', 'Todos os campos são obrigatórios');
                return;
            }

            // Validação de CPF (formato básico)
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            if (!cpfRegex.test(cpf)) {
                Alert.alert('Erro', 'CPF inválido. Use o formato: 123.456.789-00');
                return;
            }

            // Validação de senha
            if (senha.length < 6) {
                Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
                return;
            }

            // Confirmar senha
            if (senha !== confirmaSenha) {
                Alert.alert('Erro', 'As senhas não coincidem');
                return;
            }

            // Criar objeto com os dados do usuário
            const userData = {
                nome,
                cpf,
                apelido,
                senha
            };

            const response = await
                fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/contas", {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify(userData)
                });

            if (!response.ok) {
                const dataError = await response.json();
                throw new Error(dataError?.message);
            }

            Alert.alert(
                'Cadastro realizado',
                `Usuário ${apelido} cadastrado com sucesso!`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.push("/Login")
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert(error?.message)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to Rala</Text>
                        <Text style={styles.subtitle}>Create a commitment-free profile to explore financial products</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Full name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor="#999999"
                            value={nome}
                            onChangeText={setNome}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Document</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123.456.789-10"
                            placeholderTextColor="#999999"
                            value={cpf}
                            onChangeText={formatarCPF}
                            keyboardType="numeric"
                            maxLength={14}
                        />

                        <Text style={styles.label}>Nickname</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John"
                            placeholderTextColor="#999999"
                            value={apelido}
                            onChangeText={setApelido}
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                        />

                        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        padding: 24,
    },
    closeButton: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginBottom: 5,
    },
    closeButtonText: {
        fontSize: 28,
        fontWeight: '300',
        color: '#000',
    },
    header: {
        marginTop: 10,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7d7d7d',
        lineHeight: 22,
    },
    form: {
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontWeight: '400',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        fontSize: 16,
        color: '#333333',
    },
    button: {
        backgroundColor: '#ff3366',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});