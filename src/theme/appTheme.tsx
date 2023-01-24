import { StyleSheet } from "react-native";
export const colores = {
    primary: "#fab3b3",
    background : '#e7e7e793'
}

export const styles = StyleSheet.create({
    title : {
        fontSize : 35,
        fontWeight : 'bold',
    },
    subtitle : {
        fontSize : 20,
    },
    globalMargin :{
        marginHorizontal: 20
    },
    avatar : {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    avatarContainer : {
        alignItems:'center',
        marginTop:20
    },
    menuContainer: {
        marginVertical: 30,
        marginHorizontal : 30,
        alignItems: 'flex-start'
    }, 
    menuButton : {
        marginVertical: 10    
    },
    ButtonSuccess: {
        backgroundColor: '#71dc98',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ButtonText : {
        fontSize : 20
    },
    menuTexto : {
        fontSize : 24
    },
    /* INPUT STYLES */
    inputStyle : {
        borderWidth : 1,
        borderColor : 'rgba(0,0,0,0.3)',
        height : 50,
        paddingHorizontal : 10,
        borderRadius : 10,
        marginVertical : 10
    }
    /*
    fondo: {
        flex: 1,
        backgroundColor: "black"
    },
    calculadoraContainer : {
        flex: 1,
        paddingHorizontal: 20,
        //Justify vertical, align horizontal
        justifyContent: "flex-end",
        //alignItems: "center"
    },
    resultado : {
        color: "white",
        fontSize: 60,
        textAlign: "right",
    },
    resultadoPequenio : {
        color: "rgba(255,255,255,0.5)",
        fontSize: 30,
        textAlign: "right",
    }
    */
    

})