import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    SafeAreaView,
} from 'react-native';


export default function Send() {
    const [contaDestino, setContaDestino] = useState('');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [token, setToken] = useState('');
    const [carregando, setCarregando] = useState(false);

    const router = useRouter();

    // Lista de categorias disponíveis
    const categorias = [
        'Alimentação',
        'Transporte',
        'Lazer',
        'Saúde',
        'Educação',
        'Moradia',
        'Outros'
    ];

    // Formatar o valor como moeda enquanto digita
    const formatarValor = (texto: string) => {
        // Remove tudo que não for número
        const apenasNumeros = texto.replace(/[^\d]/g, '');

        // Converte para centavos e depois para reais com vírgula
        if (apenasNumeros) {
            const valorNumerico = parseFloat(apenasNumeros) / 100;
            setValor(valorNumerico.toFixed(2).replace('.', ','));
        } else {
            setValor('');
        }
    };

    // Função para enviar o dinheiro
    const enviarDinheiro = async () => {
        // Validação dos campos
        if (!contaDestino.trim()) {
            Alert.alert('Erro', 'Informe a conta de destino');
            return;
        }

        if (!valor) {
            Alert.alert('Erro', 'Informe o valor da transferência');
            return;
        }

        // Converte o valor para número
        const valorNumerico = parseFloat(valor.replace(',', '.'));

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            Alert.alert('Erro', 'O valor deve ser maior que zero');
            return;
        }

        if (!categoria) {
            Alert.alert('Erro', 'Selecione uma categoria');
            return;
        }

        // Prepara os dados para envio
        const dadosTransferencia = {
            contaDestino,
            valor: valorNumerico,
            descricao: descricao.trim() || 'Transferência',
            categoria
        };

        setCarregando(true);

        try {
            const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosTransferencia),
            });

            if (!resposta.ok) {
                throw new Error('Falha ao realizar transferência');
            }

            const resultado = await resposta.json();
            
            Alert.alert(
                'Transferência Realizada',
                `Você enviou ${valor.replace(',', '.')} para ${contaDestino}`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/Dashboard')
                    }
                ]
            );

        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível realizar a transferência. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    async function getToken() {
        const token = await AsyncStorage.getItem("@token");

        if (token === null || token === undefined) {
            router.push("/Login");
            return;
        }

        setToken(token);
    }

    useEffect(() => {
        getToken();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Transfer Money</Text>
                        <View style={styles.emptySpace} />
                    </View>

                    <View style={styles.form}>

                        <Text style={styles.label}>Enter amount</Text>
                        <View style={styles.valorContainer}>
                            <Text style={styles.moedaSymbol}>R$</Text>
                            <TextInput
                                style={styles.inputValor}
                                placeholder="0,00"
                                keyboardType="numeric"
                                value={valor}
                                onChangeText={formatarValor}
                            />
                        </View>

                        <Text style={styles.label}></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Add Nickname"
                            value={contaDestino}
                            onChangeText={setContaDestino}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Text style={styles.label}></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Transference Reason"
                            value={descricao}
                            onChangeText={setDescricao}
                            maxLength={100}
                        />

                        <Text style={styles.label}>Category</Text>
                        <View style={styles.categoriasContainer}>
                            {categorias.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoriaItem,
                                        categoria === cat && styles.categoriaItemSelecionada
                                    ]}
                                    onPress={() => setCategoria(cat)}
                                >
                                    <Text
                                        style={[
                                            styles.categoriaTexto,
                                            categoria === cat && styles.categoriaTextoSelecionado
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.botaoEnviar,
                                carregando && styles.botaoDesabilitado
                            ]}
                            onPress={enviarDinheiro}
                            disabled={carregando}
                        >
                            <Text style={styles.botaoEnviarTexto}>
                                {carregando ? 'Sending...' : 'Send Money'}
                            </Text>
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
    keyboardAvoid: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    backButtonText: {
        fontSize: 24,
        color: '#6366F1',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e3e5c',
    },
    emptySpace: {
        width: 20,
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        color: '#2e3e5c',
        marginBottom: 8,
        marginTop: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    valorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#e0e0e0',
        paddingHorizontal: 16,
    },
    moedaSymbol: {
        fontSize: 18,
        color: '#2e3e5c',
        marginRight: 8,
    },
    inputValor: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoriasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    categoriaItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        margin: 4,
    },
    categoriaItemSelecionada: {
        backgroundColor: '#6366F1',
    },
    categoriaTexto: {
        color: '#2e3e5c',
        fontSize: 14,
    },
    categoriaTextoSelecionado: {
        color: '#ffffff',
        fontWeight: '500',
    },
    botaoEnviar: {
        backgroundColor: '#ff3366',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#ff3366',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    botaoDesabilitado: {
        backgroundColor: '#a0a0a0',
        shadowOpacity: 0,
        elevation: 0,
    },
    botaoEnviarTexto: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
