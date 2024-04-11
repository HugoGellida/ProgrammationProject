import ChatColors from "./InsideParametersTranslation.js/ChatColorsTranslation"
import ChatTitles from "./InsideParametersTranslation.js/ChatTitlesTranslation"
import Colors from "./InsideParametersTranslation.js/ColorsTranslation"
import Global from "./InsideParametersTranslation.js/GlobalTranslation"
import Languages from "./InsideParametersTranslation.js/LanguagesTranslation"
import Shop from "./InsideParametersTranslation.js/ShopTranslation"
import Statistics from "./InsideParametersTranslation.js/StatisticsTranslation"
import Titles from "./InsideParametersTranslation.js/TitlesTranslation"



const Parameters = {
    EN: {
        Languages: Languages.EN,
        ChatColors: ChatColors.EN,
        ChatTitles: ChatTitles.EN,
        Shop: Shop.EN,
        Statistics: Statistics.EN,
        Global: Global.EN,
        Colors: Colors.EN,
        Titles: Titles.EN,
        Exit: 'Leave',
        Disconnect: 'Disconnect'
    },
    FR: {
        Languages: Languages.FR,
        ChatColors: ChatColors.FR,
        ChatTitles: ChatTitles.FR,
        Shop: Shop.FR,
        Statistics: Statistics.FR,
        Global: Global.FR,
        Colors: Colors.FR,
        Titles: Titles.FR,
        Exit: 'Quitter',
        Disconnect: 'Se deconnecter'
    },
    ESP: {
        Languages: Languages.ESP,
        ChatColors: ChatColors.ESP,
        ChatTitles: ChatTitles.ESP,
        Shop: Shop.ESP,
        Statistics: Statistics.ESP,
        Global: Global.ESP,
        Colors: Colors.ESP,
        Titles: Titles.ESP,
        Exit: 'Dejar',
        Disconnect: 'Desconnectar'
    }
}

export default Parameters;