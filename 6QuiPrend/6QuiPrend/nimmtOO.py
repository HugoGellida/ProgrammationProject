from players.humanPlayer import HumanPlayer
from game.nimmtGame import NimmtGame
from players.botFaible import botFaible #bot1
from players.botFort import botFort
from players.botRandom import botRandom
from players.botCustomPlayer import BotCustomPlayer
from players.botEchantillon import botEchantillon
from players.botMinMax import botMinMax
from flask import Flask, render_template, request, redirect, url_for, send_file
from io import BytesIO
import base64
import matplotlib.pyplot as plt
import random

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
                players.append(botFort("bot21"))
                players.append(botFort("bot22"))

            if number == "3":
                players.append(botFort("bot1"))
                players.append(botFaible("bot2"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))


            if number =="4":
                players.append(botFort("bot1"))
                players.append(botFaible("bot2"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))
                players.append(HumanPlayer("player3"))

            
            if number =="5":
                players.append(botFort("bot1"))
                players.append(botFaible("bot2"))
                players.append(botRandom("bot3"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            
            if number =="6":
                players.append(botFort("bot1"))
                players.append(botFort("bot2"))
                players.append(BotCustomPlayer("bot3"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))
                players.append(HumanPlayer("player3"))


            if number =="7":
                players.append(BotCustomPlayer("bot1"))
                players.append(botFort("bot2"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            if number =="8":
                players.append(BotEchantillonagePlayer("bot1"))
                players.append(botRandom("bot2"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            if number =="9":
                players.append(BotCustomPlayer("bot1"))
                players.append(botFort("bot2"))
                players.append(botRandom("bot3"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            if number =="10":            
                players.append(BotEchantillonagePlayer("bot1"))
                players.append(botFort("bot2"))
                players.append(botRandom("bot3"))
                players.append(botRandom("bot1"))
                players.append(HumanPlayer("player1"))
                players.append(HumanPlayer("player2"))

            if number =="11":
                players.append(BotCustomPlayer("bot1"))
                players.append(botFort("bot2"))
                
            if number =="12":
                players.append(BotCustomPlayer("bot1"))
                players.append(botFort("bot2")) 
                players.append(botRandom("bot3"))  

            if number =="13":
                players.append(BotEchantillonagePlayer("bot1"))
                players.append(botFaible("bot2")) 
                players.append(botRandom("bot3")) 

            if number =="14":
                players.append(BotCustomPlayer("bot1"))
                players.append(botFort("bot2")) 
                players.append(botRandom("bot3")) 
                players.append(botFaible("bot4")) 


            if number =="15":
                players.append(botRandom("bot1")) 
                players.append(botRandom("bot2")) 

            

            game=NimmtGame(players)
            scores, winners=game.play()

            print("La partie est terminée!")
            print("Scores finaux :")
            return scores.items(),winners
            return scores.items(),winners
        except ValueError:
            print("Veuillez entrer un nombre entier.")


def generate_plot(number, repetition):
    liste = []
    for _ in range(repetition):
        (score, winners) = interactiveRun(number)
        liste += score
    liste_m = moyenne(liste)
    nom, m = zip(*liste_m)
    
    #plt.plot(nom, m, marker="x", linestyle="")
    nameColor = []
    colors = ['red', 'blue', 'gray', 'purple', 'orange', 'yellow', 'black', 'pink']
    for i in range(len(nom)):
        nameColor.append(colors[random.randint(0, 7)])
    plt.bar(nom, m, color=nameColor, width=0.5)
    plt.xlabel('Bots')
    plt.ylabel("Average")

    img_bytesio = BytesIO()
    plt.savefig(img_bytesio, format='png')
    plt.close()
    img_bytesio.seek(0)
    return base64.b64encode(img_bytesio.getvalue()).decode('utf-8')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        number = request.form['number']
        repetition = int(request.form['repetition'])
        liste = []
        image = generate_plot(number, repetition)
        return render_template('index.html', image=image)
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