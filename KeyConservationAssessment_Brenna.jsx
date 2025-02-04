//notes
//instructions:
//Build a tic tac toe game where:

// •	You can take turns with another player playing tic-tac-toe (in the same browser tab, no networking needed)

// •	Players are able to see past matches and view the result of each game, including a 'snapshot' of the board, allowing players to review how their games ended

// •	The interface should be styled to the best of your ability

// •	The game should work and appear correctly in different window sizes

//understanding the games:
// this game must allow two players to take turns playing Tic Tac Toe in the same browser tab
//Players need to be able to view past matches, including the result and an image of the board itself
//the interface should be styled and responsive to multiple screen sizes

//build:
//3x3 grid where players can choose either X or O
//need to be able to track the current board, whose turn it is, and the game history
//need to store past matches with results and board snapshots
//needs to be able to reset itself so players can start a new game
//will need to use StyleSheet to make sure the game is responsive to different screen sizes

//making the game:
//going to use flexDirection: 'row' and flewWrap: 'wrap
//each square is TouchableOpacity that updates the board state when pressed.
//using useState to manage the board state (board), current player (isNext), and game history (history)
//implementing calculateWinner to check for winnable combinations
//added a resetGame function to clear the board to start a new game
//each game's board plus result is stored in the history array
// the history will be viewable in a scrollable list using ScrollView
//using StyleSheet to style the board, squares, buttons, and history list
//the layout is responsive by using Dimensions.get('window').width
//if time, will also try to implement a feature to play against AI

import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [history, setHistory] = useState([]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const winner = calculateWinner(newBoard);
    if (winner || !newBoard.includes(null)) {
      const result = winner ? `Winner: ${winner}` : "Draw";
      setHistory([...history, { board: newBoard, result }]);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const renderSquare = (index) => {
    return (
      <TouchableOpacity
        style={styles.square}
        onPress={() => handleClick(index)}
      >
        <Text style={styles.squareText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  const renderHistory = () => {
    return history.map((match, idx) => (
      <View key={idx} style={styles.historyItem}>
        <Text style={styles.historyText}>
          Game {idx + 1}: {match.result}
        </Text>
        <View style={styles.historyBoard}>
          {match.board.map((value, i) => (
            <Text key={i} style={styles.historySquare}>
              {value || "-"}
            </Text>
          ))}
        </View>
      </View>
    ));
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : board.includes(null)
      ? `Next Player: ${isXNext ? "X" : "O"}`
      : "Draw";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {Array(9)
          .fill(null)
          .map((_, index) => renderSquare(index))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
      <ScrollView style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Game History</Text>
        {renderHistory()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: Dimensions.get("window").width * 0.8,
    aspectRatio: 1,
  },
  square: {
    width: "33%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  squareText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  historyContainer: {
    marginTop: 20,
    width: "100%",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
  },
  historyBoard: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  historySquare: {
    width: "33%",
    textAlign: "center",
    fontSize: 16,
  },
});

export default App;
