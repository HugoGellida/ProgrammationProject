from players.humanPlayer import HumanPlayer
from game.nimmtGame import NimmtGame
from players.bot1Player import Bot1Player
from players.botCustomPlayer import BotCustomPlayer
from players.botEchantillonagePlayer import BotEchantillonagePlayer
from players.bot2Player import Bot2Player
from players.bot3Player import Bot3Player
from flask import Flask, render_template, request, redirect, url_for
import matplotlib.pyplot as plt

app = Flask(__name__)

def interactiveRun(number):
    print("Bienvenue sur le jeu 6 qui prend !")
    while True:
        try:
            players=[]
            if number == "1":
                players.append(BotCustomPlayer("bot1"))
                players.append(BotCustomPlayer("bot2"))

            if number == "2":
                players.append(Bot2Player("bot21"))
                players.append(Bot2Player("bot22"))

            if number == "3":
                players.append(Bot2Player("bot1"))
                players.append(Bot1Player("bot2"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))


            if number =="4":
                players.append(Bot2Player("bot1"))
                players.append(Bot1Player("bot2"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))
                players.append(HumanPlayer("player3"))

            
            if number =="5":
                players.append(Bot2Player("bot1"))
                players.append(Bot1Player("bot2"))
                players.append(Bot3Player("bot3"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            
            if number =="6":
                players.append(Bot2Player("bot1"))
                players.append(Bot2Player("bot2"))
                players.append(BotCustomPlayer("bot3"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))
                players.append(HumanPlayer("player3"))


            if number =="7":
                players.append(BotCustomPlayer("bot1"))
                players.append(Bot2Player("bot2"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            if number =="8":
                players.append(BotEchantillonagePlayer("bot1"))
                players.append(Bot3Player("bot2"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            if number =="9":
                players.append(BotCustomPlayer("bot1"))
                players.append(Bot2Player("bot2"))
                players.append(Bot3Player("bot3"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            if number =="10":            
                players.append(BotEchantillonagePlayer("bot1"))
                players.append(Bot2Player("bot2"))
                players.append(Bot3Player("bot3"))
                players.append(Bot3Player("bot1"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            if number =="11":
                players.append(BotCustomPlayer("bot1"))
                players.append(Bot2Player("bot2"))
                
            if number =="12":
                players.append(BotCustomPlayer("bot1"))
                players.append(Bot2Player("bot2")) 
                players.append(Bot3Player("bot3"))  

            if number =="13":
                players.append(BotEchantillonagePlayer("bot1"))
                players.append(Bot1Player("bot2")) 
                players.append(Bot3Player("bot3")) 

            if number =="14":
                players.append(BotCustomPlayer("bot1"))
                players.append(Bot2Player("bot2")) 
                players.append(Bot3Player("bot3")) 
                players.append(Bot1Player("bot4")) 


            if number =="15":
                players.append(Bot3Player("bot1")) 
                players.append(Bot3Player("bot2")) 

            

            game=NimmtGame(players)
            scores, winners=game.play()

            print("La partie est terminée!")
            print("Scores finaux :")
            return scores.items(),winners
        except ValueError:
            print("Veuillez entrer un nombre entier.")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        number = request.form['number']
        repetition = int(request.form['repetition'])
        liste = []
        for _ in range(repetition):
            (score, winners) = interactiveRun(number)
            liste += score
        liste_m = moyenne(liste)
        nom, m = zip(*liste_m)
        plt.plot(nom, m, marker="x", linestyle="")
        plt.xlabel('Bots')
        plt.ylabel("Average")
        
        plt.savefig("graph.png")
        plt.close()
        return render_template('index.html', s=liste_m)
    return render_template('index.html', s=None)


def moyenne(liste):
    nb_par_nom={}
    for playername, score in liste :
        if playername in nb_par_nom:
            nb_par_nom[playername].append(score)
        else:
            nb_par_nom[playername]=[score]
    moyenne_par_nom = []
    for nom, points in nb_par_nom.items():
        moyenne_par_nom.append((nom, sum(points)/len(points)))
    return moyenne_par_nom


@app.route('/play', methods=['POST'])
def play_game():
    selected_number = int(request.form['selected_number'])
    # Code pour créer les joueurs en fonction du numéro sélectionné et lancer le jeu
    return "Le jeu a été lancé avec la combinaison de joueurs sélectionnée."


if __name__ == "__main__":
    app.run(debug=True)