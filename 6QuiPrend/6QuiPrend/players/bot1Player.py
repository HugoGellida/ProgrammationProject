class Bot1Player(Player):
    def info(self, message):
        print("@"+self.name+" : ",message)

    def getLineToRemove(self, game):
        table = game.table
        minIndexLine = 0
        minOfLine = -1
        for index, row in enumerate(table):
            total = game.total_cows(row)
            print('analysing on bot play: total card of', index, 'is', total)
            if (total < minOfLine or minOfLine != -1):
                minIndexLine = index
                minOfLine = total
        print('the bot chose to remove line', minIndexLine)
        return minIndexLine


    def getCardToPlay(self):    
        """
        Permet d'obtenir la carte à jouer.

        :return: La réponse du joueur.
        """    
        while True:
            try:
                response = int(input(f"@{self.name} ({self.score}🐮) quelle carte voulez-vous jouer ? "))
                if response <= 0:
                    raise ValueError
                return response
            except ValueError:
                self.info("Veuillez entrer un nombre entier positif.")
    
    def player_turn(self, game):
        """
        Gère le tour de jeu d'un joueur.

        :param game : le jeu en cours
        """
        self.info(game.display_scores())
        self.info(game.display_table())
        while True:
            self.info(f"Votre main : {' '.join(map(str, self.hand))}")
            try:
                carteChoisie = Card(self.getCardToPlay())
                if carteChoisie in self.hand:
                    return carteChoisie
                else:
                    self.info("Vous n'avez pas cette carte dans votre main")
            except ValueError:
                self.info("Veuillez entrer un nombre entier correspondant à une carte dans votre main.")