const PageChoix = {
    EN: {
        Options: {
            Parameters: 'Parameters',
            Resume: 'Resume a game',
            Create: 'Create a game'
        },
        Name: 'Lobby',
        IDPlaceHolder: 'Type the ID of a game',
        IDSubmit: 'Enter',
        Filter: {
            All: 'All',
            War: 'War',
            Take6: 'Take 6',
            Crazy8: 'Crazy 8'
        },
        Game: 'Game {{id}} {{actualPlayerAmount}}/{{playerAmount}}',
        GameType: {
            'jeu-de-bataille': 'War',
            '6-qui-prend': 'Take 6',
            crazy8: 'Crazy 8'
        }
    },
    FR: {
        Options: {
            Parameters: 'Paramètres',
            Resume: 'Reprendre une partie',
            Create: 'Créer une partie'
        },
        Name: 'Salon',
        IDPlaceHolder: "Tapez l'ID d'une partie",
        IDSubmit: 'Entrer',
        Filter: {
            All: 'Tous',
            War: 'Bataille',
            Take6: '6 qui prend',
            Crazy8: '8 Américain'
        },
        Game: 'Jeu {{id}} {{actualPlayerAmount}}/{{playerAmount}}',
        GameType: {
            'jeu-de-bataille': 'Bataille',
            '6-qui-prend': '6 qui prend',
            crazy8: '8 Américain'
        }
    }
}

export default PageChoix;