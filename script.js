document.addEventListener('DOMContentLoaded', function () {
    const editClubSelect = document.getElementById('editClubSelect');
    const editClubForm = document.getElementById('editClubForm');
    const saveClubButton = document.getElementById('saveClubButton');
    const teamInput = document.getElementById('teamInput');
    const teamList = document.getElementById('teamList');
    const addTeamButton = document.getElementById('addTeamButton');

    let teams = [];

    // Load clubs into the dropdown
    function loadClubsForEditing() {
        const clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        editClubSelect.innerHTML = '<option value="">-- Select a Club --</option>';
        Object.keys(clubDetails).forEach(clubName => {
            const option = document.createElement('option');
            option.value = clubName;
            option.textContent = clubName;
            editClubSelect.appendChild(option);
        });
    }

    // Add teams to the list
    addTeamButton.addEventListener('click', function () {
        const teamName = teamInput.value.trim();
        if (teamName) {
            teams.push(teamName);
            const li = document.createElement('li');
            li.textContent = teamName;
            teamList.appendChild(li);
            teamInput.value = '';  // Clear input field
        }
    });

    // When a club is selected, load the current details into the form
    editClubSelect.addEventListener('change', function () {
        const clubName = this.value;
        if (clubName) {
            const clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};
            const club = clubDetails[clubName];

            if (club) {
                editClubForm.style.display = 'block';
                document.getElementById('clubName').value = clubName;
                document.getElementById('clubOverview').value = club.overview || '';
                document.getElementById('clubVenue').value = club.venue || '';
                teams = club.teams || [];
                teamList.innerHTML = '';  // Clear existing teams
                teams.forEach(team => {
                    const li = document.createElement('li');
                    li.textContent = team;
                    teamList.appendChild(li);
                });
            }
        } else {
            editClubForm.style.display = 'none';
        }
    });

    // Save the edited club details
    saveClubButton.addEventListener('click', function () {
        const clubName = document.getElementById('clubName').value.trim();
        const clubOverview = document.getElementById('clubOverview').value.trim();
        const clubVenue = document.getElementById('clubVenue').value.trim();

        if (!clubName) {
            alert('Club Name is required');
            return;
        }

        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        // Update club details in localStorage
        clubDetails[clubName] = {
            ...clubDetails[clubName],
            overview: clubOverview,
            venue: clubVenue,
            teams: teams
        };

        localStorage.setItem('clubDetails', JSON.stringify(clubDetails));

        alert('Club details updated successfully!');
        loadClubsForEditing(); // Reload the clubs dropdown to reflect any name changes
    });

    // Load clubs when the page is ready
    loadClubsForEditing();
});


document.addEventListener('DOMContentLoaded', function () {
    const fixtureForm = document.getElementById('fixtureForm');
    const addFixtureButton = document.getElementById('addFixtureButton');
    const existingFixturesList = document.getElementById('existingFixturesList');
    const homeTeamSelect = document.getElementById('homeTeam');
    const awayTeamSelect = document.getElementById('awayTeam');
    const venueInput = document.getElementById('venue');

    let fixtures = JSON.parse(localStorage.getItem('fixtures')) || [];

    // Load clubs into the dropdown for teams
    function loadClubs() {
        const clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        homeTeamSelect.innerHTML = '<option value="">-- Select Home Team --</option>';
        awayTeamSelect.innerHTML = '<option value="">-- Select Away Team --</option>';
        
        Object.keys(clubDetails).forEach(clubName => {
            const option = document.createElement('option');
            option.value = clubName;
            option.textContent = clubName;
            homeTeamSelect.appendChild(option);
            awayTeamSelect.appendChild(option.cloneNode(true)); // Clone for away team
        });
    }

    // When home team is selected, auto-fill the venue
    homeTeamSelect.addEventListener('change', function () {
        const clubName = this.value;
        const clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        if (clubDetails[clubName]) {
            venueInput.value = clubDetails[clubName].venue || 'Unknown venue';
        } else {
            venueInput.value = '';  // Clear if no valid selection
        }
    });

    // Function to display fixtures in the admin panel
    function loadFixtures() {
        existingFixturesList.innerHTML = '';
        if (fixtures.length > 0) {
            fixtures.forEach((fixture, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${fixture.date}</td>
                    <td>${fixture.team1}</td>
                    <td>${fixture.team2}</td>
                    <td>${fixture.venue}</td>
                    <td>
                        <button onclick="editFixture(${index})">Edit</button>
                        <button onclick="deleteFixture(${index})">Delete</button>
                    </td>
                `;
                existingFixturesList.appendChild(row);
            });
        } else {
            existingFixturesList.innerHTML = '<tr><td colspan="5">No fixtures found.</td></tr>';
        }
    }

    // Add a new fixture
    addFixtureButton.addEventListener('click', function () {
        const fixtureDate = document.getElementById('fixtureDate').value;
        const homeTeam = homeTeamSelect.value;
        const awayTeam = awayTeamSelect.value;
        const venue = venueInput.value.trim();

        if (fixtureDate && homeTeam && awayTeam && venue) {
            fixtures.push({ date: fixtureDate, team1: homeTeam, team2: awayTeam, venue: venue });
            localStorage.setItem('fixtures', JSON.stringify(fixtures));  // Save to localStorage
            alert('Fixture added successfully!');
            loadFixtures();  // Reload the fixtures list
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Edit a fixture
    window.editFixture = function (index) {
        const fixture = fixtures[index];
        document.getElementById('fixtureDate').value = fixture.date;
        homeTeamSelect.value = fixture.team1;
        awayTeamSelect.value = fixture.team2;
        venueInput.value = fixture.venue;

        // Remove the fixture being edited from the list so it can be updated
        fixtures.splice(index, 1);
        localStorage.setItem('fixtures', JSON.stringify(fixtures));  // Save the updated fixtures array
        loadFixtures();
    };

    // Delete a fixture
    window.deleteFixture = function (index) {
        if (confirm('Are you sure you want to delete this fixture?')) {
            fixtures.splice(index, 1);  // Remove fixture from array
            localStorage.setItem('fixtures', JSON.stringify(fixtures));  // Save updated array to localStorage
            loadFixtures();  // Reload the fixtures list
        }
    };

    // Load clubs and fixtures when the page is ready
    loadClubs();
    loadFixtures();
});

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const clubName = params.get('club');
    const clubNameHeader = document.getElementById('clubNameHeader');
    const clubOverviewText = document.getElementById('clubOverviewText');
    const clubVenueText = document.getElementById('venueText');

    // Set the club name in the header
    clubNameHeader.textContent = clubName;

    // Get club details from localStorage
    let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

    if (clubDetails[clubName]) {
        clubOverviewText.textContent = clubDetails[clubName].overview || 'No overview available';
        clubVenueText.textContent = clubDetails[clubName].venue || 'Unknown venue';
    } else {
        clubOverviewText.textContent = 'Club not found';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const clubName = params.get('club');
    const clubNameHeader = document.getElementById('clubNameHeader');
    const playersList = document.getElementById('clubPlayersList');
    const matchesList = document.getElementById('clubMatchesList');

    // Set the club name in the header
    clubNameHeader.textContent = clubName;

    // Get club details from localStorage
    let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

    if (clubDetails[clubName] && Array.isArray(clubDetails[clubName].players)) {
        const players = clubDetails[clubName].players;
        playersList.innerHTML = '';

        if (players.length > 0) {
            players.forEach(player => {
                const row = document.createElement('tr');
                const playerCell = document.createElement('td');
                const playerLink = document.createElement('a');
                playerLink.href = `profile.html?player=${encodeURIComponent(player)}`;
                playerLink.textContent = player;
                playerCell.appendChild(playerLink);
                row.appendChild(playerCell);
                playersList.appendChild(row); // Add row to the table body
            });
        } else {
            playersList.innerHTML = '<tr><td>No players in this club.</td></tr>';
        }

        // Load matches for this club
        const matches = clubDetails[clubName].matches || [];
        matchesList.innerHTML = '';

        if (matches.length > 0) {
            matches.forEach(match => {
                const matchElement = document.createElement('div');
                matchElement.classList.add('league-match');
                matchElement.innerHTML = `
                    <h4>${match.round}</h4>
                    <div class="match-info">
                        <p>${match.team1[0].name} & ${match.team1[1].name} vs ${match.team2[0].name} & ${match.team2[1].name}</p>
                        <p>Score: ${match.team1[0].scores.join('-')} vs ${match.team2[0].scores.join('-')}</p>
                    </div>
                    <p class="match-location">${match.date} | ${match.location}</p>
                `;
                matchesList.appendChild(matchElement);
            });
        } else {
            matchesList.innerHTML = '<p>No matches found for this club.</p>';
        }
    } else {
        playersList.innerHTML = '<tr><td>No players found for this club.</td></tr>';
    }

    
});

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle form submission with validation
        // Add/Edit Game form submission
    const leagueGameForm = document.getElementById('leagueGameForm');
    if (leagueGameForm) {
        leagueGameForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveEditedMatch();
        });
    }


    function saveEditedMatch() {
        const matchData = getMatchDataFromForm();
        if (matchData) {
            addGameToPlayerProfiles(matchData);
            alert('Match details saved successfully.');
            leagueGameForm.reset();
        } else {
            console.error('Error fetching match data from form.');
        }
    }

    function getMatchDataFromForm() {
        const round = document.getElementById('round').value.trim();
        const team1Player1 = document.getElementById('team1Player1').value.trim();
        const team1Player2 = document.getElementById('team1Player2').value.trim();
        const team1Scores = document.getElementById('team1Scores').value.split(',').map(Number);
        const team2Player1 = document.getElementById('team2Player1').value.trim();
        const team2Player2 = document.getElementById('team2Player2').value.trim();
        const team2Scores = document.getElementById('team2Scores').value.split(',').map(Number);
        const location = document.getElementById('location').value.trim();
        const date = document.getElementById('date').value;

        if (!round || !team1Player1 || !team1Player2 || !team2Player1 || !team2Player2 || !date || !location) {
            console.error('All form fields must be filled.');
            return null;
        }

        return {
            round: round,
            team1: [
                { name: team1Player1, scores: team1Scores },
                { name: team1Player2, scores: [] }
            ],
            team2: [
                { name: team2Player1, scores: team2Scores },
                { name: team2Player2, scores: [] }
            ],
            location: location,
            date: date
        };
    }

    if (window.location.pathname.includes('profile.html')) {
        loadProfile();
        setupTabs(); // Setup tab switching

        // Load player-specific content when the respective tab is opened
        document.querySelector('[data-tab="ranking"]').addEventListener('click', function() {
            const playerName = document.getElementById('playerNameHeader').textContent;
            updatePlayerRank(playerName);
        });

        document.querySelector('[data-tab="league"]').addEventListener('click', function() {
            const playerName = document.getElementById('playerNameHeader').textContent;
            loadLeagueMatches(playerName);
        });

        document.querySelector('[data-tab="tournaments"]').addEventListener('click', function() {
            const playerName = document.getElementById('playerNameHeader').textContent;
            loadTournaments(playerName);
        });
    }

    // Function to update the player's rank
    function updatePlayerRank(playerName) {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());

        if (player) {
            players.sort((a, b) => b.gamesWon - a.gamesWon || b.totalGames - a.totalGames);
            const rank = players.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase()) + 1;
            document.getElementById('rankingInfo').textContent = `Rank: ${rank}`;
        } else {
            document.getElementById('rankingInfo').textContent = 'Player not found';
        }
    }

    // Function to load the player's league matches
    function loadLeagueMatches(playerName) {
        const playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
        const normalizedPlayerName = playerName.trim().toLowerCase();
        let leagueMatches = playerGames[normalizedPlayerName] || [];

        leagueMatches.sort((a, b) => new Date(b.date) - new Date(a.date));

        const leagueMatchesContainer = document.getElementById('leagueMatches');
        leagueMatchesContainer.innerHTML = ''; // Clear old matches

        if (leagueMatches.length === 0) {
            leagueMatchesContainer.innerHTML = '<p>No league matches found for this player.</p>';
            return;
        }

        leagueMatches.forEach(match => {
            const matchElement = document.createElement('div');
            matchElement.classList.add('league-match');
            matchElement.innerHTML = `
                <h4>${match.round}</h4>
                <div class="match-info">
                    <p>${match.team1[0].name} & ${match.team1[1].name} vs ${match.team2[0].name} & ${match.team2[1].name}</p>
                    <p>Score: ${match.team1[0].scores.join('-')} vs ${match.team2[0].scores.join('-')}</p>
                </div>
                <p class="match-location">${match.date} | ${match.location}</p>
            `;
            leagueMatchesContainer.appendChild(matchElement);
        });
    }

    // Function to load the player's tournaments
    function loadTournaments(playerName) {
        const playerTournaments = JSON.parse(localStorage.getItem('playerTournaments')) || {};
        const normalizedPlayerName = playerName.trim().toLowerCase();
        const tournaments = playerTournaments[normalizedPlayerName] || [];

        const tournamentsList = document.getElementById('tournamentsList');
        tournamentsList.innerHTML = ''; // Clear old content

        if (tournaments.length === 0) {
            tournamentsList.innerHTML = `<p>${playerName} has not played any tournaments.</p>`;
            return;
        }

        tournaments.forEach(tournament => {
            const tournamentElement = document.createElement('div');
            tournamentElement.classList.add('tournament-item');
            tournamentElement.innerHTML = `
                <h4>${tournament.name}</h4>
                <p>${tournament.date}</p>
                <p>${tournament.location}</p>
            `;
            tournamentsList.appendChild(tournamentElement);
        });
    }

    

    // Function to setup the tabs
    function setupTabs() {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');

        // Add click event listener to each tab link
        tabLinks.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove 'active' class from all tab links and contents
                tabLinks.forEach(link => link.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add 'active' class to the clicked tab and its corresponding content
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    function loadProfile() {
        const params = new URLSearchParams(window.location.search);
        const playerName = params.get('player').replace(/-/g, ' ').toLowerCase();
    
        // Load player data from localStorage
        const players = JSON.parse(localStorage.getItem('players')) || [];
        const player = players.find(p => p.name.toLowerCase() === playerName);
    
        if (!player) {
            document.querySelector('.container').innerHTML = '<h1>Player Not Found</h1>';
            return;
        }
    
        // Set player data on the profile page
        document.getElementById('playerNameHeader').textContent = player.name;
        document.getElementById('totalGamesText').textContent = player.totalGames || 0;
        document.getElementById('gamesWonText').textContent = player.gamesWon || 0;
        document.getElementById('winPercentageText').textContent = player.winPercentage ? player.winPercentage + '%' : '0%';
        
        const initials = player.name.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('avatarInitials').textContent = initials;
    
        const winPercentage = player.winPercentage || 0;
        document.querySelector('.progress').style.width = `${winPercentage}%`;
    
        // Set club information and link
        const clubName = player.club || 'No club';
        const clubLinkElement = document.getElementById('clubLink');
        
        if (clubName !== 'No club') {
            clubLinkElement.textContent = clubName;
            clubLinkElement.href = `club-profile.html?club=${encodeURIComponent(clubName)}`;  // Create the link to the club profile
        } else {
            clubLinkElement.textContent = 'No club';
            clubLinkElement.removeAttribute('href');  // Remove the link if no club
        }
    }

    // Existing leaderboard and admin panel functionality
    if (window.location.pathname.includes('admin.html')) {
        updateTable(true);
    } else {
        updateTable(false);
    }

    function updateTable(isAdmin) {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        const leaderboardBody = document.getElementById('playerTableBodyTotal');
        const leaderboardBodyMen = document.getElementById('playerTableBodyMen');
        const leaderboardBodyWomen = document.getElementById('playerTableBodyWomen');            leaderboardBody.innerHTML = ''; // Clear old leaderboard

        leaderboardBodyMen.innerHTML = '';  // Clear men's leaderboard
        leaderboardBodyWomen.innerHTML = '';  // Clear women's leaderboard
    
        players.sort((a, b) => b.gamesWon - a.gamesWon || a.totalGames - b.totalGames);

        players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><a href="profile.html?player=${player.name.replace(/\s+/g, '-')}">${player.name}</a></td>
                <td>${player.totalGames}</td>
                <td>${player.gamesWon}</td>
                <td>${player.winPercentage}%</td>
            `;
            leaderboardBody.appendChild(row);

            // Append to the appropriate leaderboard based on gender
            if (player.gender === 'male') {
                leaderboardBodyMen.appendChild(row);
            } else if (player.gender === 'female') {
                leaderboardBodyWomen.appendChild(row);
            }
        });
    }

    // Function to handle form submission
    if (leagueGameForm) {
        leagueGameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const matchData = getMatchDataFromForm();
            if (matchData) {
                addGameToPlayerProfiles(matchData);
            }
        });
    }
    

    function getMatchDataFromForm() {
        const round = document.getElementById('round').value.trim();
        const team1Player1 = document.getElementById('team1Player1').value.trim();
        const team1Player2 = document.getElementById('team1Player2').value.trim();
        const team1Scores = document.getElementById('team1Scores').value.split(',').map(Number);
        const team2Player1 = document.getElementById('team2Player1').value.trim();
        const team2Player2 = document.getElementById('team2Player2').value.trim();
        const team2Scores = document.getElementById('team2Scores').value.split(',').map(Number);
        const location = document.getElementById('location').value.trim();
        const date = document.getElementById('date').value;

        if (!round || !team1Player1 || !team1Player2 || !team2Player1 || !team2Player2 || !date || !location) {
            console.error('All form fields must be filled.');
            return null;
        }

        return {
            round: round,
            team1: [{ name: team1Player1, scores: team1Scores }, { name: team1Player2, scores: [] }],
            team2: [{ name: team2Player1, scores: team2Scores }, { name: team2Player2, scores: [] }],
            location: location,
            date: date
        };
    }

    function addGameToPlayerProfiles(matchData) {
        let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
        let players = JSON.parse(localStorage.getItem('players')) || [];
        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};
    
        const playerNames = [
            matchData.team1[0].name.toLowerCase(),
            matchData.team1[1].name.toLowerCase(),
            matchData.team2[0].name.toLowerCase(),
            matchData.team2[1].name.toLowerCase()
        ];
    
        let clubsAdded = new Set(); // Track which clubs have been updated
    
        playerNames.forEach(playerName => {
            if (!playerName) return;
            if (!playerGames[playerName]) playerGames[playerName] = [];
            playerGames[playerName].push(matchData);
    
            const playerData = players.find(p => p.name.toLowerCase() === playerName);
            if (playerData) {
                playerData.totalGames = (playerData.totalGames || 0) + 1;
    
                const team1ScoreSum = matchData.team1[0].scores.reduce((a, b) => a + b, 0);
                const team2ScoreSum = matchData.team2[0].scores.reduce((a, b) => a + b, 0);
                const playerIsInTeam1 = matchData.team1.some(p => p.name.toLowerCase() === playerName);
    
                const team1Won = team1ScoreSum > team2ScoreSum;
                if ((team1Won && playerIsInTeam1) || (!team1Won && !playerIsInTeam1)) {
                    playerData.gamesWon = (playerData.gamesWon || 0) + 1;
                }
    
                playerData.winPercentage = ((playerData.gamesWon / playerData.totalGames) * 100).toFixed(2);
    
                // Add match to the player's club (ensure it's added only once per club)
                const playerClub = playerData.club;
                if (clubDetails[playerClub] && !clubsAdded.has(playerClub)) {
                    if (!clubDetails[playerClub].matches) {
                        clubDetails[playerClub].matches = [];
                    }
    
                    // Check if the match has already been added
                    const matchExists = clubDetails[playerClub].matches.some(
                        m => m.date === matchData.date && m.round === matchData.round
                    );
    
                    if (!matchExists) {
                        clubDetails[playerClub].matches.push(matchData);
                        clubsAdded.add(playerClub); // Mark this club as having the match added
                    }
                }
            }
        });
    
        localStorage.setItem('playerGames', JSON.stringify(playerGames));
        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('clubDetails', JSON.stringify(clubDetails));
    }
    
    

    function saveMatch(playerName, matchIndex) {
        const matchElement = document.querySelectorAll('.match-item')[matchIndex];
        
        const newDate = matchElement.querySelector('.match-date').value;
        const newLocation = matchElement.querySelector('.match-location').value;
        const newTeam1Player1Name = matchElement.querySelector('.team1-player1-name').value.toLowerCase();
        const newTeam1Player2Name = matchElement.querySelector('.team1-player2-name').value.toLowerCase();
        const newTeam2Player1Name = matchElement.querySelector('.team2-player1-name').value.toLowerCase();
        const newTeam2Player2Name = matchElement.querySelector('.team2-player2-name').value.toLowerCase();
        const newTeam1Scores = matchElement.querySelector('.team1-scores').value.split(',').map(s => s.trim());
        const newTeam2Scores = matchElement.querySelector('.team2-scores').value.split(',').map(s => s.trim());
    
        let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
    
        // Get the match for the selected player
        const currentMatch = playerGames[playerName][matchIndex];
    
        // Players involved in this match
        const involvedPlayers = [
            { name: currentMatch.team1[0].name.toLowerCase(), newName: newTeam1Player1Name },
            { name: currentMatch.team1[1].name.toLowerCase(), newName: newTeam1Player2Name },
            { name: currentMatch.team2[0].name.toLowerCase(), newName: newTeam2Player1Name },
            { name: currentMatch.team2[1].name.toLowerCase(), newName: newTeam2Player2Name }
        ];
    
        // Update match for each player involved
        involvedPlayers.forEach(playerInfo => {
            if (playerInfo.name !== playerInfo.newName) {
                moveMatchToNewPlayer(playerInfo.name, playerInfo.newName, currentMatch);
            }
    
            let playerMatches = playerGames[playerInfo.name] || [];
    
            const matchToUpdate = playerMatches[matchIndex];
            if (matchToUpdate) {
                matchToUpdate.date = newDate;
                matchToUpdate.location = newLocation;
                matchToUpdate.team1[0].name = newTeam1Player1Name;
                matchToUpdate.team1[0].scores = newTeam1Scores;
                matchToUpdate.team1[1].name = newTeam1Player2Name;
                matchToUpdate.team2[0].name = newTeam2Player1Name;
                matchToUpdate.team2[0].scores = newTeam2Scores;
                matchToUpdate.team2[1].name = newTeam2Player2Name;
            }
    
            playerGames[playerInfo.name] = playerMatches;
        });
    
        // Update local storage
        localStorage.setItem('playerGames', JSON.stringify(playerGames));
    
        // Recalculate statistics for all players involved
        recalculateStatsForPlayers(involvedPlayers.map(p => p.newName));
    
        alert('Match updated for all involved players.');
    }
    
    

    function recalculateStatsForPlayers(players) {
        let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
        let allPlayers = JSON.parse(localStorage.getItem('players')) || [];
    
        players.forEach(player => {
            const playerName = player.toLowerCase();
            const playerData = allPlayers.find(p => p.name.toLowerCase() === playerName);
            const remainingMatches = playerGames[playerName] || [];
            let gamesWon = 0;
    
            remainingMatches.forEach(match => {
                const team1Score = (match.team1[0].scores || []).reduce((a, b) => a + b, 0);
                const team2Score = (match.team2[0].scores || []).reduce((a, b) => a + b, 0);
                const isInTeam1 = match.team1.some(p => p.name.toLowerCase() === playerName);
                const team1Won = team1Score > team2Score;
    
                if ((team1Won && isInTeam1) || (!team1Won && !isInTeam1)) {
                    gamesWon++;
                }
            });
    
            if (playerData) {
                playerData.totalGames = remainingMatches.length;
                playerData.gamesWon = gamesWon;
                playerData.winPercentage = playerData.totalGames > 0 ? ((gamesWon / playerData.totalGames) * 100).toFixed(2) : 0;
            }
        });
    
        localStorage.setItem('players', JSON.stringify(allPlayers));
    }

    const editPlayerSelect = document.getElementById('editPlayerSelect');
    const playerMatchesSection = document.getElementById('playerMatchesSection');
    const playerMatchesList = document.getElementById('playerMatchesList');

    // Load player options dynamically for selection
    function loadPlayerOptionsForEdit() {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        const selectElement = document.getElementById('editPlayerSelect');
        selectElement.innerHTML = '';  // Clear existing options to avoid duplicates
    
        players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.name.toLowerCase();
            option.textContent = player.name;
            selectElement.appendChild(option);
        });
    }    

    function loadPlayerMatchesForEdit() {
        const playerName = editPlayerSelect.value.toLowerCase();
        if (!playerName) return;
    
        const playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
        const playerMatches = playerGames[playerName] || [];
    
        playerMatchesList.innerHTML = ''; // Clear old matches
    
        if (playerMatches.length === 0) {
            playerMatchesSection.style.display = 'none';
            return;
        }
    
        playerMatchesSection.style.display = 'block';
    
        playerMatches.forEach((match, index) => {
            const matchElement = document.createElement('div');
            matchElement.classList.add('match-item');
            matchElement.innerHTML = `
                <h4>Match ${index + 1} - ${match.round}</h4>
                <p><strong>Date:</strong> <input type="date" class="match-date" value="${match.date}"></p>
                <p><strong>Location:</strong> <input type="text" class="match-location" value="${match.location}"></p>
                <p><strong>Team 1 Player 1:</strong> <input type="text" class="team1-player1-name" value="${match.team1[0].name}">
                - Scores: <input type="text" class="team1-scores" value="${match.team1[0].scores.join(', ')}"></p>
                <p><strong>Team 1 Player 2:</strong> <input type="text" class="team1-player2-name" value="${match.team1[1].name}"></p>
                <p><strong>Team 2 Player 1:</strong> <input type="text" class="team2-player1-name" value="${match.team2[0].name}">
                - Scores: <input type="text" class="team2-scores" value="${match.team2[0].scores.join(', ')}"></p>
                <p><strong>Team 2 Player 2:</strong> <input type="text" class="team2-player2-name" value="${match.team2[1].name}"></p>
                <button class="save-match-button" data-index="${index}">Save Match</button>
                <button class="delete-match-button" data-index="${index}">Delete Match</button>
            `;
            playerMatchesList.appendChild(matchElement);
        });
    
        // Add event listeners for saving and deleting matches
        document.querySelectorAll('.delete-match-button').forEach(button => {
            button.addEventListener('click', function () {
                const matchIndex = this.getAttribute('data-index');
                deleteMatch(playerName, matchIndex);  // Call deleteMatch function
            });
        });
    }

    const playerNameInput = document.getElementById('playerNameInput');
    const clubSelect = document.getElementById('clubSelect');
    const addPlayerForm = document.getElementById('addPlayerForm');

    // Check if the input fields exist
    if (!playerNameInput || !clubSelect) {
        console.error('Player name or club input field not found.');
        return;
    }

    // Function to load clubs into the dropdown
    function loadClubOptions() {
        clubSelect.innerHTML = '';  // Clear previous options

        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        if (Object.keys(clubDetails).length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No clubs available';
            option.disabled = true;
            clubSelect.appendChild(option);
            return;
        }

        Object.keys(clubDetails).forEach(clubName => {
            const option = document.createElement('option');
            option.value = clubName;
            option.textContent = clubName;
            clubSelect.appendChild(option);
        });
    }

    loadClubOptions(); // Call this function to populate clubs when the page loads

    // Handle form submission to add a new player
    if (addPlayerForm) {
        addPlayerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const playerName = playerNameInput.value.trim();
            const selectedClub = clubSelect.value.trim();

            if (!playerName || !selectedClub) {
                alert('Player name and club are required.');
                return;
            }

            let players = JSON.parse(localStorage.getItem('players')) || [];
            let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

            // Check if the player already exists
            if (players.some(player => player.name.toLowerCase() === playerName.toLowerCase())) {
                alert('Player already exists.');
                return;
            }

            // Add the new player
            const newPlayer = {
                name: playerName,
                club: selectedClub,
                totalGames: 0,
                gamesWon: 0,
                winPercentage: 0
            };
            players.push(newPlayer);

            // Ensure players array exists for the selected club and add the player
            if (!clubDetails[selectedClub].players || !Array.isArray(clubDetails[selectedClub].players)) {
                clubDetails[selectedClub].players = [];
            }
            clubDetails[selectedClub].players.push(playerName);

            // Save updated data back to localStorage
            localStorage.setItem('players', JSON.stringify(players));
            localStorage.setItem('clubDetails', JSON.stringify(clubDetails));

            // Clear the form
            playerNameInput.value = '';
            clubSelect.value = '';

            alert(`Player ${playerName} added to club ${selectedClub}.`);
        });
    } else {
        console.error('Add Player form not found.');
    }

    function deleteMatch(playerName, matchIndex) {
        let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};
        const match = playerGames[playerName][matchIndex];
        
        if (!match) {
            alert('Match not found.');
            return;
        }
    
        // Collect all involved players
        const involvedPlayers = [...match.team1, ...match.team2];
    
        involvedPlayers.forEach(player => {
            const playerNameLower = player.name.toLowerCase();
            if (playerGames[playerNameLower]) {
                // Remove the match from the player's list of matches
                playerGames[playerNameLower].splice(matchIndex, 1);
                recalculatePlayerStatistics(playerNameLower);  // Recalculate stats for each player
            }
        });
    
        // Remove the match from the club's profile
        Object.keys(clubDetails).forEach(clubName => {
            if (clubDetails[clubName].matches) {
                clubDetails[clubName].matches = clubDetails[clubName].matches.filter(
                    m => !(m.date === match.date && m.round === match.round && m.team1[0].name === match.team1[0].name && m.team2[0].name === match.team2[0].name)
                );
            }
        });
    
        // Save updated playerGames and clubDetails back to localStorage
        localStorage.setItem('playerGames', JSON.stringify(playerGames));
        localStorage.setItem('clubDetails', JSON.stringify(clubDetails));
    
        alert('Match deleted and stats updated successfully.');
        loadPlayerMatchesForEdit();  // Refresh the match list
    }

    function loadClubProfile() {
        const params = new URLSearchParams(window.location.search);
        const clubName = params.get('club');
    
        const clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};
        const club = clubDetails[clubName];
    
        if (!club) {
            document.getElementById('clubOverviewText').textContent = 'Club not found.';
            return;
        }
    
        // Set club details
        document.getElementById('playerNameHeader').textContent = club.name;
        document.getElementById('clubOverviewText').textContent = club.overview || '';
        document.getElementById('club-location').textContent = club.venue || 'Unknown location';
        
        // Display the matches for the club
        const matchesList = document.getElementById('clubMatchesList');
        matchesList.innerHTML = '';  // Clear old matches
    
        if (club.matches && club.matches.length > 0) {
            club.matches.forEach(match => {
                const matchElement = document.createElement('li');
                matchElement.innerHTML = `
                    <h4>Round: ${match.round}</h4>
                    <p>${match.team1[0].name} & ${match.team1[1].name} vs ${match.team2[0].name} & ${match.team2[1].name}</p>
                    <p>Score: ${match.team1[0].scores.join('-')} vs ${match.team2[0].scores.join('-')}</p>
                    <p>Date: ${match.date}, Location: ${match.location}</p>
                `;
                matchesList.appendChild(matchElement);
            });
        } else {
            matchesList.innerHTML = '<li>No matches found for this club.</li>';
        }
    }
    

    // Save the edited match
    function saveMatch(playerName, matchIndex) {
        const matchElement = document.querySelectorAll('.match-item')[matchIndex];
    
        const newDate = matchElement.querySelector('.match-date').value;
        const newLocation = matchElement.querySelector('.match-location').value;
        const newTeam1Player1Name = matchElement.querySelector('.team1-player1-name').value.toLowerCase();
        const newTeam1Player2Name = matchElement.querySelector('.team1-player2-name').value.toLowerCase();
        const newTeam2Player1Name = matchElement.querySelector('.team2-player1-name').value.toLowerCase();
        const newTeam2Player2Name = matchElement.querySelector('.team2-player2-name').value.toLowerCase();
        const newTeam1Scores = matchElement.querySelector('.team1-scores').value.split(',').map(s => s.trim());
        const newTeam2Scores = matchElement.querySelector('.team2-scores').value.split(',').map(s => s.trim());
    
        // Retrieve the current match data from playerGames
        const currentMatch = playerGames[playerName][matchIndex];
    
        // Move the match from old players' profiles if names have changed
        const involvedPlayers = [
            { oldName: currentMatch.team1[0].name.toLowerCase(), newName: newTeam1Player1Name, teamIndex: 0 },
            { oldName: currentMatch.team1[1].name.toLowerCase(), newName: newTeam1Player2Name, teamIndex: 0 },
            { oldName: currentMatch.team2[0].name.toLowerCase(), newName: newTeam2Player1Name, teamIndex: 1 },
            { oldName: currentMatch.team2[1].name.toLowerCase(), newName: newTeam2Player2Name, teamIndex: 1 }
        ];
    
        involvedPlayers.forEach((playerInfo) => {
            if (playerInfo.oldName !== playerInfo.newName) {
                moveMatchToNewPlayer(playerInfo.oldName, playerInfo.newName, currentMatch, playerInfo.teamIndex === 0, playerInfo.teamIndex, newTeam1Scores, newTeam2Scores);
            }
        });
    
        // Update the match data for the current player
        playerGames[playerName][matchIndex] = {
            ...currentMatch,
            date: newDate,
            location: newLocation,
            team1: [
                { name: newTeam1Player1Name, scores: newTeam1Scores },
                { name: newTeam1Player2Name, scores: [] }
            ],
            team2: [
                { name: newTeam2Player1Name, scores: newTeam2Scores },
                { name: newTeam2Player2Name, scores: [] }
            ]
        };
    
        localStorage.setItem('playerGames', JSON.stringify(playerGames));
        recalculateStatsForPlayers(involvedPlayers.map(p => ({ name: p.oldName })));
        recalculateStatsForPlayers(involvedPlayers.map(p => ({ name: p.newName })));
        alert('Match updated successfully.');
        loadPlayerMatchesForEdit(); // Refresh the match list
    }
    
    function moveMatchToNewPlayer(oldName, newName, match, team1Won, teamIndex, team1Scores, team2Scores) {
        // Remove match from old player's profile
        if (oldName && playerGames[oldName]) {
            playerGames[oldName] = playerGames[oldName].filter(m => m !== match);
            recalculatePlayerStatistics(oldName);
        }
    
        // Add match to new player's profile
        if (newName) {
            if (!playerGames[newName]) {
                playerGames[newName] = [];
            }
            playerGames[newName].push(match);
            recalculatePlayerStatistics(newName);
        }
    }    

    // Delete the selected match
    


    // Load player options and matches on page load
    if (editPlayerSelect) {
        loadPlayerOptionsForEdit();
        editPlayerSelect.addEventListener('change', loadPlayerMatchesForEdit);
    }
    

    // Load player matches for edit on player selection change
    if (editPlayerSelect) {
        editPlayerSelect.addEventListener('change', loadPlayerMatchesForEdit);
    }

    function handleFormSubmission(formId, callback) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                callback();
            });
        } else {
            console.error(`${formId} not found.`);
        }
    }

    // This is duplicated, you only need one of these
    handleFormSubmission('addPlayerForm', function() {
        addPlayer();
    });

    if (addPlayerForm) {
    addPlayerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addPlayer();
        });
    } else {
        console.error('Add Player form not found.');
    }


    // Handle league game form submission
    handleFormSubmission('leagueGameForm', function() {
        const matchData = getMatchDataFromForm();  // Make sure getMatchDataFromForm function is defined
        if (matchData) {
            addGameToPlayerProfiles(matchData);
        } else {
            console.error('Error fetching match data from form.');
        }
    });

    // Handle submitting league match
    // Fixing event listener issue by ensuring elements are loaded before adding listeners
    const submitButton = document.getElementById('submitLeagueMatchButton');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Submit button clicked');
        });
    }

    function deleteMatchForAllPlayers(playerName, matchIndex) {
        let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
        const match = playerGames[playerName][matchIndex];
    
        if (!match) {
            alert('Match not found.');
            return;
        }
    
        // Collect all involved players
        const involvedPlayers = [...match.team1, ...match.team2];
    
        involvedPlayers.forEach(player => {
            const playerNameLower = player.name.toLowerCase();
            if (playerGames[playerNameLower]) {
                // Remove the match from the player's list of matches
                playerGames[playerNameLower].splice(matchIndex, 1);
            }
        });
    
        // Update the localStorage with the updated games for all players
        localStorage.setItem('playerGames', JSON.stringify(playerGames));
    
        // Recalculate stats for all players involved in the deleted match
        recalculateStatsForPlayers(involvedPlayers);
    
        // Update leaderboard and any other necessary UI elements
        updateLeaderboard();
        loadPlayerMatchesForEdit();  // Refresh the match list
    }
    
    
    // Function to recalculate stats for all involved players
    function recalculateStatsForPlayers(players) {
        let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
        let allPlayers = JSON.parse(localStorage.getItem('players')) || [];
    
        players.forEach(player => {
            
    if (!player || !player.name) {
        console.error('Player object or player name is undefined:', player);
        return;
    }
    const playerName = player.name.toLowerCase();
    
            const playerData = allPlayers.find(p => p.name.toLowerCase() === playerName);
            const remainingMatches = playerGames[playerName] || [];
            let gamesWon = 0;
    
            remainingMatches.forEach(match => {
                const team1Score = (match.team1[0].scores || []).reduce((a, b) => a + b, 0);
                const team2Score = (match.team2[0].scores || []).reduce((a, b) => a + b, 0);
                const isInTeam1 = match.team1.some(p => p.name.toLowerCase() === playerName);
                const team1Won = team1Score > team2Score;
    
                if ((team1Won && isInTeam1) || (!team1Won && !isInTeam1)) {
                    gamesWon++;
                }
            });
    
            if (playerData) {
                playerData.totalGames = remainingMatches.length;
                playerData.gamesWon = gamesWon;
                playerData.winPercentage = playerData.totalGames > 0 ? ((gamesWon / playerData.totalGames) * 100).toFixed(2) : 0;
            }
        });
    
        // Save updated player stats to localStorage
        localStorage.setItem('players', JSON.stringify(allPlayers));
    }

    // Load player options without duplicates
    function loadPlayerOptionsForEdit() {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        const selectElement = document.getElementById('editPlayerSelect');
        selectElement.innerHTML = '';  // Clear existing options to avoid duplicates

        players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.name.toLowerCase();
            option.textContent = player.name;
            selectElement.appendChild(option);
        });
    }

    // Load player options on page load
    loadPlayerOptionsForEdit();

    // Page-specific loading logic
    const page = window.location.pathname;
    if (page.includes('admin.html')) {
        updateTable(true);
        loadPlayerOptionsForEdit();
    } else if (page.includes('profile.html')) {
        loadProfile();
        setupTabs();
    } else if (page.includes('clubs.html')) {
        loadClubs();
    } else if (page.includes('players.html')) {
        loadPlayers();
    } else if (page.includes('tournaments.html')) {
        loadTournaments();
    } else {
        updateTable(false);  // Default table for non-admin pages
    }

    // Ensure default tab 'Overview' is open
    const defaultTab = document.querySelector('.tablink');
    if (defaultTab) {
        openTab({ currentTarget: defaultTab }, 'Overview');
    }


    document.getElementById('editPlayerSelect').addEventListener('change', function() {
        const selectedPlayerIndex = this.value;  // This should now be the index of the player
        if (selectedPlayerIndex !== '') {
            loadPlayerMatches(selectedPlayerIndex);  // Pass the index to load the player's matches
        }
    });      
    const playerSelect = document.getElementById('editPlayerSelect');
    if (playerSelect) {
        playerSelect.addEventListener('change', function() {
            const selectedPlayerIndex = this.value;
            if (selectedPlayerIndex !== '') {
                loadPlayerMatches(selectedPlayerIndex);
            }
        });
    }  

    function deletePlayer(playerName) {
        // Get the list of players from localStorage
        let players = JSON.parse(localStorage.getItem('players')) || [];
        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};
    
        // Find the player by name
        const playerIndex = players.findIndex(player => player.name.toLowerCase() === playerName.toLowerCase());
        const playerToDelete = players[playerIndex];
    
        // If player exists, proceed with deletion
        if (playerToDelete && playerIndex > -1) {
            const playerClub = playerToDelete.club;
    
            // Remove the player from the players array
            players.splice(playerIndex, 1);
    
            // Remove the player from their club's player list
            if (playerClub && clubDetails[playerClub]) {
                clubDetails[playerClub].players = clubDetails[playerClub].players.filter(player => player.toLowerCase() !== playerName.toLowerCase());
            }
    
            // Update localStorage with the new players list and club details
            localStorage.setItem('players', JSON.stringify(players));
            localStorage.setItem('clubDetails', JSON.stringify(clubDetails));
    
            // Optionally, remove the player's matches from playerGames
            let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
            delete playerGames[playerName.toLowerCase()];
            localStorage.setItem('playerGames', JSON.stringify(playerGames));
    
            alert(`${playerName} has been deleted and removed from their club.`);
            // Refresh the player table and club list
            updateTable(true);
            loadClubs();
        } else {
            alert(`${playerName} not found.`);
        }
    }
    
    
    
    // Update the table to include a delete button
    function updateTable(isAdmin) {
        const players = JSON.parse(localStorage.getItem('players')) || [];
        const leaderboardBody = document.getElementById('playerTableBodyTotal');
        leaderboardBody.innerHTML = ''; // Clear old leaderboard
    
        players.sort((a, b) => b.gamesWon - a.gamesWon || a.totalGames - b.totalGames);
    
        players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><a href="profile.html?player=${player.name.replace(/\s+/g, '-')}">${player.name}</a></td>
                <td>${player.totalGames}</td>
                <td>${player.gamesWon}</td>
                <td>${player.winPercentage}%</td>
                <td>
                    <button onclick="deletePlayer('${player.name}')">Delete</button> <!-- Delete button -->
                </td>
            `;
            leaderboardBody.appendChild(row);
        });
    }
    
    loadClubs();

    // Add event listener to the club form for adding new clubs
    const addClubForm = document.getElementById('addClubForm');
    addClubForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const clubName = document.getElementById('newClubNameInput').value.trim();

        if (!clubName) {
            alert('Club name is required.');
            return;
        }

        // Get existing club details from localStorage
        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        if (clubDetails[clubName]) {
            alert('Club already exists.');
            return;
        }

        // Add new club to clubDetails
        clubDetails[clubName] = {
            players: {}
        };

        // Save updated club details to localStorage
        localStorage.setItem('clubDetails', JSON.stringify(clubDetails));

        // Clear the form input
        document.getElementById('newClubNameInput').value = '';

        // Reload the clubs table to show the newly added club
        loadClubs();

        alert(`Club ${clubName} added successfully.`);
    });


    // Function to delete a club
    function deleteClub(clubName) {
        const clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        if (clubDetails[clubName]) {
            delete clubDetails[clubName]; // Remove club from localStorage
            localStorage.setItem('clubDetails', JSON.stringify(clubDetails));
            loadClubs(); // Reload the updated list of clubs
            alert(`Club ${clubName} deleted successfully.`);
        } else {
            alert(`Club ${clubName} not found.`);
        }
    }

    loadClubOptions();
    



    // Check if the fields are available before proceeding
    if (!playerNameInput || !clubSelect) {
        console.error('Player name or club input field not found.');
        return;
    }

    document.addEventListener('DOMContentLoaded', function() {
        const addPlayerForm = document.getElementById('addPlayerForm');
        
        addPlayerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const playerName = document.getElementById('playerNameInput').value.trim();
            const selectedClub = document.getElementById('clubSelect').value.trim();
    
            if (!playerName || !selectedClub) {
                alert('Player name and club are required.');
                return;
            }
    
            // Get players and clubs from localStorage
            let players = JSON.parse(localStorage.getItem('players')) || [];
            let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};
    
            // Check if player already exists
            if (players.some(player => player.name.toLowerCase() === playerName.toLowerCase())) {
                alert('Player already exists.');
                return;
            }
    
            // Add the player to the players list
            const newPlayer = {
                name: playerName,
                club: selectedClub,
                totalGames: 0,
                gamesWon: 0,
                winPercentage: 0
            };
            players.push(newPlayer);
    
            // Add the player to the selected club
            if (clubDetails[selectedClub]) {
                clubDetails[selectedClub].players = clubDetails[selectedClub].players || [];
                clubDetails[selectedClub].players.push(playerName);
            } else {
                clubDetails[selectedClub] = { players: [playerName] };
            }
    
            // Update localStorage
            localStorage.setItem('players', JSON.stringify(players));
            localStorage.setItem('clubDetails', JSON.stringify(clubDetails));
    
            // Clear form inputs
            document.getElementById('playerNameInput').value = '';
            document.getElementById('clubSelect').value = '';
    
            alert(`Player ${playerName} added to club ${selectedClub}.`);
        });
    });
    

    // Function to load clubs into the dropdown
    function loadClubOptions() {
        const clubSelect = document.getElementById('clubSelect');
        clubSelect.innerHTML = '';  // Clear previous options

        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        if (Object.keys(clubDetails).length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No clubs available';
            option.disabled = true;
            clubSelect.appendChild(option);
            return;
        }

        Object.keys(clubDetails).forEach(clubName => {
            const option = document.createElement('option');
            option.value = clubName;
            option.textContent = clubName;
            clubSelect.appendChild(option);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const tournamentsTableBody = document.getElementById('tournamentsTableBody');
    const isAdminPage = window.location.pathname.includes('admin.html');
    const params = new URLSearchParams(window.location.search);
    const tournamentName = params.get('tournament');
    const tournamentHeader = document.getElementById('tournamentNameHeader');
    const locationInput = document.getElementById('tournamentLocation');
    const dateInput = document.getElementById('tournamentDate');
    const overviewInput = document.getElementById('tournamentOverviewInput');
    const playerList = document.getElementById('tournamentPlayersList');
    const matchList = document.getElementById('tournamentMatchesList');

    function loadTournaments() {
        tournamentsTableBody.innerHTML = '';
        const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];

        tournaments.forEach(tournament => {
            const link = isAdminPage
                ? `tournament-admin.html?tournament=${encodeURIComponent(tournament.name)}`
                : `tournament-profile.html?tournament=${encodeURIComponent(tournament.name)}`;
                
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="${link}">${tournament.name}</a></td>
                <td>${tournament.location}</td>
                <td>${tournament.date}</td>
                ${isAdminPage ? `<td><button onclick="deleteTournament('${tournament.name}')">Delete</button></td>` : ''}
            `;
            tournamentsTableBody.appendChild(row);
        });
    }

    function loadTournament() {
        const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
        const tournament = tournaments.find(t => t.name === tournamentName);

        if (tournament) {
            tournamentHeader.textContent = tournament.name;
            locationInput.value = tournament.location || '';
            dateInput.value = tournament.date || '';
            overviewInput.value = tournament.overview || '';
            loadPlayers(tournament.players || []);
            loadMatches(tournament.matches || []);
        } else {
            alert('Tournament not found');
        }
    }

    function loadPlayers(players) {
        const playerList = document.getElementById('tournamentPlayersList');
        playerList.innerHTML = '';  // Clear the list
    
        players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player;
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deletePlayerFromTournament(player);
    
            li.appendChild(deleteButton);
            playerList.appendChild(li);
        });
    }    

    // Function to delete a player from the tournament
    function deletePlayerFromTournament(playerName) {
        const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
        const tournamentIndex = tournaments.findIndex(t => t.name === tournamentName);

        if (tournamentIndex > -1) {
            const playerIndex = tournaments[tournamentIndex].players.indexOf(playerName);
            if (playerIndex > -1) {
                tournaments[tournamentIndex].players.splice(playerIndex, 1);
                localStorage.setItem('tournaments', JSON.stringify(tournaments));
                alert(`${playerName} has been removed from the tournament.`);
                loadPlayers(tournaments[tournamentIndex].players);  // Refresh the player list
            }
        } else {
            alert('Tournament not found');
        }
    }


    function loadMatches(matches) {
        matchList.innerHTML = '';
        matches.forEach(match => {
            const li = document.createElement('li');
            li.textContent = `${match.details} - ${match.date}`;
            matchList.appendChild(li);
        });
    }

    document.getElementById('addPlayerButton').addEventListener('click', function () {
        const playerName = document.getElementById('playerNameInput').value.trim();
        if (!playerName) return;
    
        // Retrieve existing players from localStorage or create an empty list
        let tournamentPlayers = JSON.parse(localStorage.getItem('tournamentPlayers')) || [];
        
        // Add player to list if they don’t already exist
        if (!tournamentPlayers.includes(playerName)) {
            tournamentPlayers.push(playerName);
            localStorage.setItem('tournamentPlayers', JSON.stringify(tournamentPlayers));
            
            // Update the displayed list in the Admin Panel
            const playerElement = document.createElement('li');
            playerElement.textContent = playerName;
            document.getElementById('tournamentPlayersList').appendChild(playerElement);
        }
        document.getElementById('playerNameInput').value = ''; // Clear input
    });
    

    document.getElementById('addMatchButton')?.addEventListener('click', function () {
        const matchDetails = document.getElementById('matchDetailsInput').value.trim();
        const matchDate = document.getElementById('matchDateInput').value;
        if (matchDetails && matchDate) {
            const li = document.createElement('li');
            li.textContent = `${matchDetails} - ${matchDate}`;
            matchList.appendChild(li);
            document.getElementById('matchDetailsInput').value = '';
            document.getElementById('matchDateInput').value = '';
        }
    });

    document.getElementById('saveTournamentChanges')?.addEventListener('click', function () {
        const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
        const tournamentIndex = tournaments.findIndex(t => t.name === tournamentName);

        if (tournamentIndex > -1) {
            tournaments[tournamentIndex].location = locationInput.value;
            tournaments[tournamentIndex].date = dateInput.value;
            tournaments[tournamentIndex].overview = overviewInput.value;
            tournaments[tournamentIndex].players = Array.from(playerList.children).map(li => li.textContent);
            tournaments[tournamentIndex].matches = Array.from(matchList.children).map(li => {
                const [details, date] = li.textContent.split(' - ');
                return { details, date };
            });

            localStorage.setItem('tournaments', JSON.stringify(tournaments));
            alert('Tournament details updated successfully!');
        } else {
            alert('Tournament not found in storage.');
        }
    });

    if (tournamentsTableBody) loadTournaments();
    if (window.location.pathname.includes('tournament-admin.html') && tournamentName) loadTournament();
});

document.addEventListener('DOMContentLoaded', function () {
    const adminTournamentsTableBody = document.getElementById('adminTournamentsTableBody');
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];

    function displayAdminTournaments() {
        adminTournamentsTableBody.innerHTML = '';
        tournaments.forEach((tournament) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="tournament-admin.html?tournament=${encodeURIComponent(tournament.name)}">${tournament.name}</a></td>
                <td>${tournament.location}</td>
                <td>${tournament.date}</td>
            `;
            adminTournamentsTableBody.appendChild(row);
        });
    }

    if (adminTournamentsTableBody) {
        displayAdminTournaments();
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const tournamentName = params.get('tournament');

    if (window.location.pathname.includes('tournament-profile.html') && tournamentName) {
        loadTournamentProfile(decodeURIComponent(tournamentName));
    }

    function loadTournamentProfile(name) {
        const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
        const tournament = tournaments.find(t => t.name === name);

        if (tournament) {
            document.getElementById('tournamentName').textContent = tournament.name;
            document.getElementById('tournamentLocation').textContent = tournament.location;
            document.getElementById('tournamentDate').textContent = tournament.date;
            document.getElementById('tournamentOverview').textContent = tournament.overview || 'Overview not provided';

            // Load players, matches, and draws if available
            const playersList = document.getElementById('tournamentPlayers');
            const matchesList = document.getElementById('tournamentMatches');
            const drawsSection = document.getElementById('tournamentDraws');

            tournament.players?.forEach(player => {
                const li = document.createElement('li');
                li.textContent = player;
                playersList.appendChild(li);
            });

            tournament.matches?.forEach(match => {
                const li = document.createElement('li');
                li.textContent = `${match.team1} vs ${match.team2} - ${match.date}`;
                matchesList.appendChild(li);
            });

            drawsSection.textContent = tournament.draws || 'Draws not available';
        } else {
            document.querySelector('.container').innerHTML = '<h1>Tournament Not Found</h1>';
        }
    }
});


let playerTournaments = JSON.parse(localStorage.getItem('playerTournaments')) || {};
let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
let players = JSON.parse(localStorage.getItem('players')) || [];

function setupTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            console.log(`Clicked on tab: ${this.getAttribute('data-tab')}`);  // Debugging line
            // Remove 'active' class from all tab links and tab content
            tabLinks.forEach(link => link.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add 'active' class to the clicked tab and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', setupTabs);

function downloadDataAsJSON() {
    const data = JSON.stringify(localStorage.getItem('playerGames'), null, 4);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playerGames.json';
    a.click();
}

function setupStatsTabs() {
    const statsTabLinks = document.querySelectorAll('.stats-tab-link');
    const statsContents = document.querySelectorAll('.stats-content');

    statsTabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            statsTabLinks.forEach(link => link.classList.remove('active'));
            statsContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            const activeStat = this.getAttribute('data-stat');
            document.getElementById(activeStat).classList.add('active');
        });
    });
}


function populatePlayerSuggestions() {
    const datalist = document.getElementById('playerSuggestions');
    datalist.innerHTML = ''; // Clear previous options

    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.name;
        datalist.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const playerNameInput = document.getElementById('playerNameInput');
    const clubSelect = document.getElementById('clubSelect');
    const addPlayerForm = document.getElementById('addPlayerForm');

    // Ensure the input fields exist
    if (!playerNameInput || !clubSelect) {
        console.error('Player name or club input field not found.');
        return;
    }

    // Load clubs into the clubSelect dropdown
    function loadClubOptions() {
        clubSelect.innerHTML = '';  // Clear previous options

        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        if (Object.keys(clubDetails).length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No clubs available';
            option.disabled = true;
            clubSelect.appendChild(option);
            return;
        }

        Object.keys(clubDetails).forEach(clubName => {
            const option = document.createElement('option');
            option.value = clubName;
            option.textContent = clubName;
            clubSelect.appendChild(option);
        });
    }

    loadClubOptions(); // Call this function to populate clubs when the page loads

    // Add event listener to handle player addition
    addPlayerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const playerName = playerNameInput.value.trim();
        const selectedClub = clubSelect.value.trim();

        if (!playerName || !selectedClub) {
            alert('Player name and club are required.');
            return;
        }

        let players = JSON.parse(localStorage.getItem('players')) || [];
        let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

        // Check if player already exists
        if (players.some(player => player.name.toLowerCase() === playerName.toLowerCase())) {
            alert('Player already exists.');
            return;
        }

        // Add the new player
        const newPlayer = {
            name: playerName,
            club: selectedClub,
            totalGames: 0,
            gamesWon: 0,
            winPercentage: 0
        };
        players.push(newPlayer);

        // Add the player to the selected club
        if (clubDetails[selectedClub]) {
            clubDetails[selectedClub].players = clubDetails[selectedClub].players || [];
            clubDetails[selectedClub].players.push(playerName);
        } else {
            clubDetails[selectedClub] = { players: [playerName] };
        }

        // Save to localStorage
        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('clubDetails', JSON.stringify(clubDetails));

        // Clear the form
        playerNameInput.value = '';
        clubSelect.value = '';

        alert(`Player ${playerName} added to club ${selectedClub}.`);
    });
});


function addPlayer() {
    const playerNameInput = document.getElementById('playerNameInput');
    const playerClubInput = document.getElementById('playerClubInput');

    if (!playerNameInput || !playerClubInput) {
        console.error('Player name or club input field not found.');
        return;
    }

    const playerName = playerNameInput.value.trim();
    const playerClub = playerClubInput.value.trim();

    if (!playerName || !playerClub) {
        console.error('Player name or club is missing.');
        return;
    }

    let players = JSON.parse(localStorage.getItem('players')) || [];

    // Check if the player already exists (to avoid duplicates)
    const existingPlayer = players.find(player => player.name.toLowerCase() === playerName.toLowerCase());
    if (existingPlayer) {
        alert('Player already exists.');
        return;
    }

    // Add the player if not already present
    players.push({ name: playerName, club: playerClub, gamesWon: 0, totalGames: 0 });

    localStorage.setItem('players', JSON.stringify(players));

    alert('Player added successfully.');
}

function addTournament() {
    const tournamentNameInput = document.getElementById('tournamentNameInput');

    if (!tournamentNameInput) {
        console.error('Tournament name input field not found.');
        return;
    }

    const tournamentName = tournamentNameInput.value.trim();

    if (!tournamentName) {
        console.error('Tournament name is missing.');
        return;
    }

    let tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];

    tournaments.push({ name: tournamentName, players: [] });

    localStorage.setItem('tournaments', JSON.stringify(tournaments));

    alert('Tournament added successfully.');
}


document.addEventListener('DOMContentLoaded', function () {
    const addTournamentForm = document.getElementById('addTournamentForm');
    const addTournamentButton = document.getElementById('addTournamentButton');
    const tournamentList = document.getElementById('tournamentList');

    // Load existing tournaments from localStorage
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];

    // Function to display tournaments
    function displayTournaments() {
        tournamentList.innerHTML = ''; // Clear existing list
        tournaments.forEach((tournament, index) => {
            const li = document.createElement('li');
            li.textContent = `${tournament.name} - ${tournament.location} (${tournament.date})`;
            tournamentList.appendChild(li);
        });
    }

    // Add tournament on form submission
    addTournamentButton.addEventListener('click', function () {
        const name = document.getElementById('tournamentName').value.trim();
        const location = document.getElementById('tournamentLocation').value.trim();
        const date = document.getElementById('tournamentDate').value;

        if (name && location && date) {
            tournaments.push({ name, location, date });
            localStorage.setItem('tournaments', JSON.stringify(tournaments));
            displayTournaments();
            addTournamentForm.reset(); // Clear form fields
            alert("Tournament added successfully!");
        } else {
            alert("All fields are required!");
        }
    });

    displayTournaments(); // Initial load
});

document.addEventListener('DOMContentLoaded', function() {
    const matchesList = document.getElementById('matchesList');

    function displayMatches() {
        matchesList.innerHTML = '';
        tournament.matches.forEach(match => {
            const matchItem = document.createElement('li');
            matchItem.classList.add('match-item');
            matchItem.innerHTML = `
                <h4>Round: ${match.round} - ${match.date}</h4>
                <div class="match-content">
                    <div class="team-display">
                        <p class="player-name">${match.team1[0].name}</p>
                        <p class="player-name">${match.team1[1].name}</p>
                    </div>
                    <div class="versus">vs</div>
                    <div class="team-display">
                        <p class="player-name">${match.team2[0].name}</p>
                        <p class="player-name">${match.team2[1].name}</p>
                    </div>
                </div>`;
            matchesList.appendChild(matchItem);
        });
    }

    // Initial call to display any matches in the tournament
    displayMatches();
});


document.addEventListener('DOMContentLoaded', function () {
    const tournamentName = new URLSearchParams(window.location.search).get('tournament');
    const matchesList = document.getElementById('tournamentMatches');

    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const tournament = tournaments.find(t => t.name === tournamentName);

    function displayMatches() {
        matchesList.innerHTML = '';
        if (tournament && tournament.matches) {
            tournament.matches.forEach(match => {
                const matchItem = document.createElement('li');
                matchItem.innerHTML = `
                    <div class="match-container">
                        <strong>Round: ${match.round}</strong> - ${match.date}<br>
                        <div class="match-info">
                            <div class="team">
                                <p>${match.team1[0].name}</p>
                                <p>${match.team1[1].name}</p>
                            </div>
                            <div class="divider"></div>
                            <div class="team">
                                <p>${match.team2[0].name}</p>
                                <p>${match.team2[1].name}</p>
                            </div>
                        </div>
                    </div>
                `;
                matchesList.appendChild(matchItem);
            });
        } else {
            matchesList.innerHTML = '<p>No matches scheduled.</p>';
        }
    }

    displayMatches();
});

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const tournamentName = params.get('tournament');

    // Admin panel: Adding and displaying players uniquely
    const addPlayerButton = document.getElementById('addPlayerButton');
    const playerNameInput = document.getElementById('playerNameInput');
    const playersListAdmin = document.getElementById('tournamentPlayersList');

    // Profile view: Displaying players uniquely
    const playersListProfile = document.getElementById('tournamentPlayers');
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const tournament = tournaments.find(t => t.name === tournamentName);

    // Deduplicate players array in localStorage on load
    if (tournament && tournament.players) {
        tournament.players = [...new Set(tournament.players)];
        localStorage.setItem('tournaments', JSON.stringify(tournaments));
    }

    // Function to display players (Admin and Profile)
    function displayPlayers(listElement) {
        listElement.innerHTML = '';
        if (tournament && tournament.players) {
            tournament.players.forEach((playerName) => {
                const playerElement = document.createElement('li');
                const playerLink = document.createElement('a');
                playerLink.href = `profile.html?player=${encodeURIComponent(playerName)}`;
                playerLink.textContent = playerName;

                playerElement.appendChild(playerLink);
                listElement.appendChild(playerElement);
            });
        } else {
            listElement.innerHTML = '<p>No players registered for this tournament.</p>';
        }
    }

    // Initial display of players in Admin panel
    if (playersListAdmin) {
        displayPlayers(playersListAdmin);
    }

    // Initial display of players in Profile view
    if (playersListProfile) {
        displayPlayers(playersListProfile);
    }

    // Adding player in Admin panel with deduplication check
    if (addPlayerButton) {
        addPlayerButton.addEventListener('click', function () {
            const playerName = playerNameInput.value.trim();
            if (playerName && !tournament.players.includes(playerName)) {
                tournament.players.push(playerName);
                localStorage.setItem('tournaments', JSON.stringify(tournaments));
                displayPlayers(playersListAdmin);  // Refresh player list in Admin panel
                playerNameInput.value = '';
            } else {
                alert(`${playerName} is already registered in this tournament or invalid name.`);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const tournamentName = params.get('tournament');
    const playersList = document.getElementById('tournamentPlayersList');
    const addPlayerButton = document.getElementById('addPlayerButton');
    const playerNameInput = document.getElementById('playerNameInput');

    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const tournament = tournaments.find(t => t.name === tournamentName) || { players: [] };

    function saveTournament() {
        const index = tournaments.findIndex(t => t.name === tournamentName);
        if (index !== -1) {
            tournaments[index] = tournament;
            localStorage.setItem('tournaments', JSON.stringify(tournaments));
        }
    }

    function displayPlayers() {
        playersList.innerHTML = '';
        if (tournament.players && tournament.players.length > 0) {
            tournament.players.forEach((playerName, index) => {
                const playerElement = document.createElement('li');
                const playerLink = document.createElement('a');
                playerLink.href = `profile.html?player=${encodeURIComponent(playerName)}`;
                playerLink.textContent = playerName;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.marginLeft = '10px';
                deleteButton.onclick = () => {
                    tournament.players.splice(index, 1);
                    saveTournament();
                    displayPlayers();
                    alert("DELTE PLAYER");

                };

                playerElement.appendChild(playerLink);
                playerElement.appendChild(deleteButton);
                playersList.appendChild(playerElement);
            });
        } else {
            playersList.innerHTML = '<p>No players registered for this tournament.</p>';
        }
    }

    displayPlayers();

    addPlayerButton.addEventListener('click', function () {
        const playerName = playerNameInput.value.trim();
        if (playerName && !tournament.players.includes(playerName)) {
            tournament.players.push(playerName);
            saveTournament();
            displayPlayers();
            playerNameInput.value = '';
        } else {
            alert("Player is already registered or no name was entered.");
        }
    });
});



// Clean the dropdown to prevent duplicate player entries
function loadPlayerOptionsForEdit() {
    const players = JSON.parse(localStorage.getItem('players')) || [];
    const selectElement = document.getElementById('editPlayerSelect');
    selectElement.innerHTML = '';  // Clear existing options to avoid duplicates

    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.name.toLowerCase();
        option.textContent = player.name;
        selectElement.appendChild(option);
    });
}

// Load player options and clear previous options to avoid duplicates
function loadPlayerOptions() {
    const players = JSON.parse(localStorage.getItem('players')) || [];
    const selectElement = document.getElementById('playerSelect');
    selectElement.innerHTML = '';  // Clear existing options

    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.name.toLowerCase();
        option.textContent = player.name;
        selectElement.appendChild(option);
    });
}

// Function to delete a club from localStorage
function deleteClub(clubName) {
    const clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

    if (clubDetails[clubName]) {
        delete clubDetails[clubName]; // Remove club from localStorage
        localStorage.setItem('clubDetails', JSON.stringify(clubDetails));
        loadClubs(); // Reload the updated list of clubs
        alert(`Club ${clubName} deleted successfully.`);
    } else {
        alert(`Club ${clubName} not found.`);
    }
}




console.log(JSON.parse(localStorage.getItem('playerGames')));

function loadLeagueMatches(playerName) {
    const playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
    const normalizedPlayerName = playerName.trim().toLowerCase();
    let leagueMatches = playerGames[normalizedPlayerName] || [];

    // Filter out null or invalid matches
    leagueMatches = leagueMatches.filter(match => match && match.round);

    // Sort matches by date in descending order (newest first)
    leagueMatches.sort((a, b) => new Date(b.date) - new Date(a.date));

    const leagueMatchesContainer = document.getElementById('leagueMatches');
    leagueMatchesContainer.innerHTML = '';  // Clear existing matches

    if (leagueMatches.length === 0) {
        leagueMatchesContainer.innerHTML = '<p>No league matches found for this player.</p>';
        return;
    }

    // Display the sorted matches
    leagueMatches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.classList.add('league-match');

        matchElement.innerHTML = `
            <h4>${match.round}</h4>
            <div class="match-info">
                <p>${match.team1[0].name} & ${match.team1[1].name} vs ${match.team2[0].name} & ${match.team2[1].name}</p>
                <p>Score: ${match.team1[0].scores.join('-')} vs ${match.team2[0].scores.join('-')}</p>
            </div>
            <p class="match-location">${match.date} | ${match.location}</p>
        `;

        leagueMatchesContainer.appendChild(matchElement);
    });
}

function updateLeaderboard() {
    const players = JSON.parse(localStorage.getItem('players')) || [];
    const leaderboardBody = document.getElementById('playerTableBodyTotal');
    leaderboardBody.innerHTML = ''; // Clear old leaderboard

    players.sort((a, b) => b.gamesWon - a.gamesWon || a.totalGames - b.totalGames);

    players.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="profile.html?player=${player.name.replace(/\s+/g, '-')}">${player.name}</a></td>
            <td>${player.totalGames}</td>
            <td>${player.gamesWon}</td>
            <td>${player.winPercentage}%</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

function loadPlayers() {
    const playersList = document.getElementById('playersList');

    if (!playersList) {
        console.error('Players list element not found.');
        return;
    }

    let players = JSON.parse(localStorage.getItem('players')) || [];

    players.forEach(player => {
        const playerItem = document.createElement('li');
        playerItem.textContent = player.name;
        playersList.appendChild(playerItem);
    });
}

function loadTournaments() {
    const tournamentsList = document.getElementById('tournamentsList');

    if (!tournamentsList) {
        console.error('Tournaments list element not found.');
        return;
    }

    let tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];

    tournaments.forEach(tournament => {
        const tournamentItem = document.createElement('li');
        tournamentItem.textContent = tournament.name;
        tournamentsList.appendChild(tournamentItem);
    });
}

function loadAdminLeagueMatches(playerName) {
    const leagueMatches = playerGames[playerName] || [];

    const playerMatchesList = document.getElementById('playerMatchesList');
    playerMatchesList.innerHTML = '';

    if (leagueMatches.length === 0) {
        playerMatchesList.innerHTML = '<p>No league matches found for this player.</p>';
        return;
    }

    // Sort matches by date, most recent first
    leagueMatches.sort((a, b) => new Date(b.date) - new Date(a.date));

    leagueMatches.forEach((match, index) => {
        const matchElement = document.createElement('div');
        matchElement.classList.add('league-match');

        matchElement.innerHTML = `
            <h4>${match.round}</h4>
            <div class="match-info">
                <div class="team">
                    <div class="player-score">
                        <p>${match.team1[0].name}</p>
                        <div class="score-list">${match.team1[0].scores.join(' ')}</div>
                    </div>
                    <div class="player-score">
                        <p>${match.team1[1].name}</p>
                        <div class="score-list"></div>
                    </div>
                    <hr>
                    <div class="player-score">
                        <p>${match.team2[0].name}</p>
                        <div class="score-list"></div>
                    </div>
                    <div class="player-score">
                        <p>${match.team2[1].name}</p>
                        <div class="score-list">${match.team2[1].scores.join(' ')}</div>
                    </div>
                </div>
            </div>
            <p class="match-location">${match.date} | ${match.location}</p>
            <button class="delete-game-button" data-index="${index}">Delete Game</button>
        `;

        playerMatchesList.appendChild(matchElement);
    });

    // Set up delete functionality for each button
    document.querySelectorAll('.delete-game-button').forEach((button, index) => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this game?')) {
                deleteGame(playerName, index);
                loadAdminLeagueMatches(playerName); // Reload the matches after deletion
            }
        });
    });
}


function moveMatchToNewPlayer(oldName, newName, match) {
    let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};

    // Remove match from old player's profile
    if (oldName && playerGames[oldName]) {
        playerGames[oldName] = playerGames[oldName].filter(m => m !== match);
    }

    // Add match to new player's profile
    if (newName) {
        if (!playerGames[newName]) {
            playerGames[newName] = [];
        }
        playerGames[newName].push(match);
    }

    localStorage.setItem('playerGames', JSON.stringify(playerGames));
}

// Function to recalculate stats for players
function recalculateStatsForPlayers(playerNames) {
    playerNames.forEach(playerName => {
        recalculatePlayerStatistics(playerName);
    });
}

// Function to recalculate stats for a single player
function recalculatePlayerStatistics(playerName) {
    let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
    let players = JSON.parse(localStorage.getItem('players')) || [];

    const playerData = players.find(p => p.name.toLowerCase() === playerName);
    const remainingMatches = playerGames[playerName] || [];
    let gamesWon = 0;

    remainingMatches.forEach(match => {
        const team1Score = (match.team1[0].scores || []).reduce((a, b) => a + b, 0);
        const team2Score = (match.team2[0].scores || []).reduce((a, b) => a + b, 0);
        const isInTeam1 = match.team1.some(p => p.name.toLowerCase() === playerName);
        const team1Won = team1Score > team2Score;

        if ((team1Won && isInTeam1) || (!team1Won && !isInTeam1)) {
            gamesWon++;
        }
    });

    if (playerData) {
        playerData.totalGames = remainingMatches.length;
        playerData.gamesWon = gamesWon;
        playerData.winPercentage = playerData.totalGames > 0 ? ((gamesWon / playerData.totalGames) * 100).toFixed(2) : 0;
    }

    localStorage.setItem('players', JSON.stringify(players));
    updateLeaderboard();  // Update leaderboard after recalculating stats
}

function updateTable(isAdmin) {
    const tableBody = document.getElementById('playerTableBodyTotal');
    if (!tableBody) {
        console.error('Table body element not found.');
        return;
    }
    tableBody.innerHTML = '';

    players.sort((a, b) => b.gamesWon - a.gamesWon);

    players.forEach((player, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        const nameCell = document.createElement('td');
        const profileLink = document.createElement('a');
        profileLink.href = `profile.html?player=${player.name.replace(/\s+/g, '-')}`;
        profileLink.textContent = player.name;
        nameCell.appendChild(profileLink);
        row.appendChild(nameCell);

        const totalGamesCell = document.createElement('td');
        totalGamesCell.textContent = player.totalGames;
        row.appendChild(totalGamesCell);

        const gamesWonCell = document.createElement('td');
        gamesWonCell.textContent = player.gamesWon;
        row.appendChild(gamesWonCell);

        const winPercentageCell = document.createElement('td');
        winPercentageCell.textContent = player.winPercentage + '%';
        row.appendChild(winPercentageCell);

        if (isAdmin) {
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deletePlayer(player.name);
            });
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
        }

        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', setupTabs);

function updateSpecificTable(type, filteredPlayers, isAdmin) {
    const tableBody = document.getElementById(`playerTableBody${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!tableBody) return;

    tableBody.innerHTML = '';

    filteredPlayers = filteredPlayers.filter(player => player.hasOwnProperty(`${type}TotalGames`));

    filteredPlayers.sort((a, b) => {
        if (b[`${type}GamesWon`] !== a[`${type}GamesWon`]) {
            return b[`${type}GamesWon`] - a[`${type}GamesWon`];
        }
        return b[`${type}TotalGames`] - a[`${type}TotalGames`];
    });

    filteredPlayers.forEach((player, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        const nameCell = document.createElement('td');
        const profileLink = document.createElement('a');
        profileLink.href = `profile.html?player=${player.name.replace(/\s+/g, '-').toLowerCase()}`;
        profileLink.textContent = player.name;
        row.appendChild(nameCell);

        const totalGamesCell = document.createElement('td');
        totalGamesCell.textContent = player[`${type}TotalGames`] || 0;
        row.appendChild(totalGamesCell);

        const gamesWonCell = document.createElement('td');
        gamesWonCell.textContent = player[`${type}GamesWon`] || 0;
        row.appendChild(gamesWonCell);

        const winPercentageCell = document.createElement('td');
        winPercentageCell.textContent = player[`${type}WinPercentage`] + '%';
        row.appendChild(winPercentageCell);

        if (isAdmin) {
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deletePlayer(player.name);
            });
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
        }

        tableBody.appendChild(row);
    });
}

function updateTableWithFilteredPlayers(filteredPlayers) {
    const tableBody = document.getElementById('playerTableBody');
    if (!tableBody) {
        console.error('Table body element not found.');
        return;
    }
    tableBody.innerHTML = '';  // Clear existing rows

    filteredPlayers.forEach((player, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        const nameCell = document.createElement('td');
        const profileLink = document.createElement('a');
        profileLink.href = `profile.html?player=${player.name.replace(/\s+/g, '-')}`;
        profileLink.textContent = player.name;
        nameCell.appendChild(profileLink);
        row.appendChild(nameCell);

        const totalGamesCell = document.createElement('td');
        totalGamesCell.textContent = player.totalGames;
        row.appendChild(totalGamesCell);

        const gamesWonCell = document.createElement('td');
        gamesWonCell.textContent = player.gamesWon;
        row.appendChild(gamesWonCell);

        const winPercentageCell = document.createElement('td');
        winPercentageCell.textContent = player.winPercentage + '%';
        row.appendChild(winPercentageCell);

        tableBody.appendChild(row);
    });
}

function updateStatElement(statType, wins, games) {
    const winPercentage = games > 0 ? Math.round((wins / games) * 100) : 0;

    const gamesWonText = document.getElementById(`${statType}GamesWonText`);
    const gamesText = document.getElementById(`${statType}GamesText`);
    const winPercentageText = document.getElementById(`${statType}WinPercentageText`);
    const progressBar = document.querySelector(`#${statType} .progress`);

    if (gamesWonText && gamesText && winPercentageText && progressBar) {
        gamesWonText.textContent = wins;
        gamesText.textContent = games;
        winPercentageText.textContent = winPercentage + '%';
        progressBar.style.width = winPercentage + '%';
    } else {
        console.error(`Elements for ${statType} stats not found.`);
    }
}

function updatePlayerRank(playerName) {
    const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    
    if (player) {
        // Sort players by games won (and by total games if needed to break ties)
        players.sort((a, b) => b.gamesWon - a.gamesWon || a.totalGames - b.totalGames);
        
        // Find the player's rank
        const rank = players.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase()) + 1;
        
        // Display the rank on the profile page
        document.getElementById('rankingInfo').textContent = `Rank: ${rank}`;
    }
}



function updateMatchInPlayerProfile(playerName, match, date, location, team1Player1Name, team1Player2Name, team1Scores, team2Player1Name, team2Player2Name, team2Scores) {
    const playerMatches = playerGames[playerName];
    if (playerMatches) {
        const matchToUpdate = playerMatches.find(m =>
            m.round === match.round &&
            m.date === match.date &&
            m.location === match.location
        );

        if (matchToUpdate) {
            matchToUpdate.date = date;
            matchToUpdate.location = location;
            matchToUpdate.team1[0].name = team1Player1Name;
            matchToUpdate.team1[1].name = team1Player2Name;
            matchToUpdate.team1[0].scores = team1Scores;
            matchToUpdate.team1[1].scores = team1Scores;
            matchToUpdate.team2[0].name = team2Player1Name;
            matchToUpdate.team2[1].name = team2Player2Name;
            matchToUpdate.team2[0].scores = team2Scores;
            matchToUpdate.team2[1].scores = team2Scores;
        }
    }
}

function recalculatePlayerStatistics(playerName) {
    const playerMatches = playerGames[playerName.toLowerCase()] || [];
    const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());

    if (!player) {
        console.error('Player not found.');
        return;
    }

    let totalGames = 0;
    let gamesWon = 0;

    // Calculate total games and wins
    playerMatches.forEach(match => {
        totalGames++;
        const team1Wins = match.team1[0].scores.reduce((a, b) => a + b, 0) > match.team2[0].scores.reduce((a, b) => a + b, 0);
        const playerInTeam1 = match.team1.some(p => p.name.toLowerCase() === playerName.toLowerCase());

        if ((team1Wins && playerInTeam1) || (!team1Wins && !playerInTeam1)) {
            gamesWon++;
        }
    });

    // Update the player's stats
    player.totalGames = totalGames;
    player.gamesWon = gamesWon;
    player.winPercentage = totalGames > 0 ? ((gamesWon / totalGames) * 100).toFixed(2) : 0;

    // Save the updated player back to localStorage
    localStorage.setItem('players', JSON.stringify(players));
}

function updatePlayerStatsAfterMatch(playersInMatch, team1TotalScore, team2TotalScore, isNewMatch) {
    // Determine winning team
    const team1Wins = team1TotalScore > team2TotalScore;
    const team2Wins = team2TotalScore > team1TotalScore;

    playersInMatch.forEach(playerInfo => {
        const player = players.find(p => p.name === playerInfo.newName);

        if (player) {
            // Increase total games played for all players only if it's a new match
            if (isNewMatch) {
                player.totalGames = player.totalGames ? player.totalGames + 1 : 1;
            }

            // If the player's team won, increase their win count
            if ((playerInfo.teamIndex === 0 && team1Wins) || (playerInfo.teamIndex === 1 && team2Wins)) {
                if (isNewMatch) {
                    player.gamesWon = player.gamesWon ? player.gamesWon + 1 : 1;
                } else {
                    // Handle case where we are editing an existing match
                    const originalTeamWon = (playerInfo.teamIndex === 0 && playerInfo.originalTeamWins) ||
                                            (playerInfo.teamIndex === 1 && !playerInfo.originalTeamWins);
                    if (originalTeamWon && !team1Wins && !team2Wins) {
                        player.gamesWon--;
                    } else if (!originalTeamWon && (team1Wins || team2Wins)) {
                        player.gamesWon++;
                    }
                }
            }

            // Recalculate win percentage
            player.winPercentage = player.totalGames > 0 ? Math.round((player.gamesWon / player.totalGames) * 100) : 0;
        }
    });
}

function removeMatchFromPlayer(playerName, match) {
    const playerMatches = playerGames[playerName];
    if (playerMatches) {
        const matchIndex = playerMatches.findIndex(m =>
            m.round === match.round &&
            m.date === match.date &&
            m.location === match.location
        );
        if (matchIndex > -1) {
            playerMatches.splice(matchIndex, 1);
        }
    }
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


function switchLeaderboard() {
    const selectedLeaderboard = document.getElementById('leaderboardSelect').value;

    // Hide all tables first
    document.querySelectorAll('.leaderboardTable').forEach(table => {
        table.style.display = 'none';
    });

    // Show the selected table
    document.getElementById(`leaderboard${selectedLeaderboard.charAt(0).toUpperCase() + selectedLeaderboard.slice(1)}`).style.display = 'table';
}


document.getElementById('someElement').addEventListener('click', function() {
    e.preventDefault();
    console.log('Form Submitted');
    
    // Capture form values
    const newMatch = {
        round: document.getElementById('round').value.trim(),
        team1: [
            {
                name: document.getElementById('team1Player1').value.trim(),
                scores: document.getElementById('team1Scores').value.split(',').map(Number) // Parsing scores
            },
            {
                name: document.getElementById('team1Player2').value.trim(),
                scores: []
            }
        ],
        team2: [
            {
                name: document.getElementById('team2Player1').value.trim(),
                scores: document.getElementById('team2Scores').value.split(',').map(Number)
            },
            {
                name: document.getElementById('team2Player2').value.trim(),
                scores: []
            }
        ],
        location: document.getElementById('location').value.trim(),
        date: document.getElementById('date').value
    };

    console.log(newMatch);  // For debugging: Check if the new match data is captured

    // Call the function to add the game
    addGameToPlayerProfiles(newMatch);

    alert('Game added successfully!');
    document.getElementById('leagueGameForm').reset();  // Optionally reset the form
});

console.log(newMatch);
console.log(playerGames);

function deletePlayer(playerName) {
    // Get the list of players from localStorage
    let players = JSON.parse(localStorage.getItem('players')) || [];
    let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

    // Find the player by name
    const playerIndex = players.findIndex(player => player.name.toLowerCase() === playerName.toLowerCase());
    const playerToDelete = players[playerIndex];

    // If player exists, proceed with deletion
    if (playerToDelete && playerIndex > -1) {
        const playerClub = playerToDelete.club;

        // Remove the player from the players array
        players.splice(playerIndex, 1);

        // Remove the player from their club's player list
        if (playerClub && clubDetails[playerClub]) {
            clubDetails[playerClub].players = clubDetails[playerClub].players.filter(player => player.toLowerCase() !== playerName.toLowerCase());
        }

        // Update localStorage with the new players list and club details
        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('clubDetails', JSON.stringify(clubDetails));

        // Optionally, remove the player's matches from playerGames
        let playerGames = JSON.parse(localStorage.getItem('playerGames')) || {};
        delete playerGames[playerName.toLowerCase()];
        localStorage.setItem('playerGames', JSON.stringify(playerGames));

        alert(`${playerName} has been deleted and removed from their club.`);
        // Refresh the player table and club list
        updateTable(true);
        loadClubs();
    } else {
        alert(`${playerName} not found.`);
    }
}


// Function to load players into the table (replace the existing one if different)
function loadPlayers() {
    const playerTableBody = document.getElementById('playerTableBody');
    playerTableBody.innerHTML = '';  // Clear any existing rows

    let players = JSON.parse(localStorage.getItem('players')) || [];

    if (players.length === 0) {
        playerTableBody.innerHTML = '<tr><td colspan="3">No players found.</td></tr>';
        return;
    }

    players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.club}</td>
            <td><button onclick="deletePlayer('${player.name}')">Delete</button></td>
        `;
        playerTableBody.appendChild(row);
    });
}

// Function to load clubs and update player count (replace the existing one if different)
function loadClubs() {
    const clubsTableBody = document.getElementById('clubsTableBody');
    clubsTableBody.innerHTML = '';  // Clear any existing rows

    let clubDetails = JSON.parse(localStorage.getItem('clubDetails')) || {};

    if (Object.keys(clubDetails).length === 0) {
        clubsTableBody.innerHTML = '<tr><td colspan="3">No clubs found.</td></tr>';
        return;
    }

    // Loop through the clubs and update the player count
    Object.keys(clubDetails).forEach(clubName => {
        const playerCount = Object.keys(clubDetails[clubName].players || {}).length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${clubName}</td>
            <td>${playerCount}</td>
            <td><button onclick="deleteClub('${clubName}')">Delete</button></td>
        `;
        clubsTableBody.appendChild(row);
    });
}


function recordGame(team1Name, team2Name, winnerName) {
    const player1 = players.find(player => player.name === team1Name);
    const player2 = players.find(player => player.name === team2Name);
    const winner = players.find(player => player.name === winnerName);

    if (player1 && player2 && winner) {
        player1.totalGames++;
        player2.totalGames++;
        winner.gamesWon++;

        const winPercentage1 = ((player1.gamesWon / player1.totalGames) * 100).toFixed(2);
        player1.winPercentage = isNaN(winPercentage1) ? 0 : winPercentage1;

        const winPercentage2 = ((player2.gamesWon / player2.totalGames) * 100).toFixed(2);
        player2.winPercentage = isNaN(winPercentage2) ? 0 : winPercentage2;

        localStorage.setItem('players', JSON.stringify(players));

        if (!playerTournaments[team1Name]) {
            playerTournaments[team1Name] = [];
        }
        playerTournaments[team1Name].push(team2Name);

        if (!playerTournaments[team2Name]) {
            playerTournaments[team2Name] = [];
        }
        playerTournaments[team2Name].push(team1Name);

        localStorage.setItem('playerTournaments', JSON.stringify(playerTournaments));

        if (!playerGames[team1Name]) {
            playerGames[team1Name] = [];
        }
        playerGames[team1Name].push({ opponent: team2Name, result: team1Name === winnerName ? 'win' : 'loss' });

        if (!playerGames[team2Name]) {
            playerGames[team2Name] = [];
        }
        playerGames[team2Name].push({ opponent: team1Name, result: team2Name === winnerName ? 'win' : 'loss' });

        localStorage.setItem('playerGames', JSON.stringify(playerGames));
    }
}

// Function to load players into the dropdown
function loadPlayersDropdown() {
    const players = JSON.parse(localStorage.getItem('players')) || [];
    const playerSelect = document.getElementById('editPlayerSelect');

    // Clear previous options
    playerSelect.innerHTML = '<option value="">--Select a Player--</option>';

    // Populate dropdown with players, using the index as the value
    players.forEach((player, index) => {
        const option = document.createElement('option');
        option.value = index;  // Use the index of the player in the players array
        option.textContent = player.name;  // Display the player's name
        playerSelect.appendChild(option);
    });
}

function loadPlayerMatches(playerIndex) {
    const players = JSON.parse(localStorage.getItem('players')) || [];

    // Check if the player exists
    if (!players[playerIndex]) {
        console.error(`Player with index ${playerIndex} not found.`);
        return;
    }

    const player = players[playerIndex];
    const playerMatchesSection = document.getElementById('playerMatchesSection');
    const playerMatchesList = document.getElementById('playerMatchesList');
    const playerNameHeader = document.getElementById('playerName');

    // Show the matches section and set the player's name
    playerMatchesSection.style.display = 'block';
    playerNameHeader.textContent = `Matches for ${player.name}`;

    // Clear previous matches
    playerMatchesList.innerHTML = '';

    // Check if the player has any matches
    if (!player.matches || player.matches.length === 0) {
        playerMatchesList.innerHTML = '<p>No matches found for this player.</p>';
        return;
    }

    // Display each match with an "Edit" button
    player.matches.forEach((match, index) => {
        const matchDiv = document.createElement('div');
        matchDiv.innerHTML = `
            <p>
                Round: ${match.round}, 
                Team 1: ${match.team1Player1}, ${match.team1Player2} 
                vs 
                Team 2: ${match.team2Player1}, ${match.team2Player2}, 
                Score: ${match.team1Scores} - ${match.team2Scores}
            </p>
            <button onclick="editMatch(${playerIndex}, ${index})">Edit</button>
        `;
        playerMatchesList.appendChild(matchDiv);
    });
}

console.log(JSON.parse(localStorage.getItem('players')));

function editMatch(playerIndex, matchIndex) {
    const players = JSON.parse(localStorage.getItem('players')) || [];
    const player = players[playerIndex];
    const match = player.matches[matchIndex];

    // Populate the form with match data
    document.getElementById('round').value = match.round;
    document.getElementById('team1Player1').value = match.team1Player1;
    document.getElementById('team1Player2').value = match.team1Player2;
    document.getElementById('team1Scores').value = match.team1Scores;
    document.getElementById('team2Player1').value = match.team2Player1;
    document.getElementById('team2Player2').value = match.team2Player2;
    document.getElementById('team2Scores').value = match.team2Scores;
    document.getElementById('date').value = match.date;
    document.getElementById('location').value = match.location;

    // Update form submission to save the edited match
    document.getElementById('leagueGameForm').onsubmit = function(e) {
        e.preventDefault();

        // Update the match with edited data
        match.round = document.getElementById('round').value;
        match.team1Player1 = document.getElementById('team1Player1').value;
        match.team1Player2 = document.getElementById('team1Player2').value;
        match.team1Scores = document.getElementById('team1Scores').value;
        match.team2Player1 = document.getElementById('team2Player1').value;
        match.team2Player2 = document.getElementById('team2Player2').value;
        match.team2Scores = document.getElementById('team2Scores').value;
        match.date = document.getElementById('date').value;
        match.location = document.getElementById('location').value;

        // Save updated data back to localStorage
        players[playerIndex].matches[matchIndex] = match;
        localStorage.setItem('players', JSON.stringify(players));

        // Reload the matches after saving
        loadPlayerMatches(playerIndex);

        alert('Match updated successfully!');
    };
}

// Initial population of the leaderboard
updateTableWithFilteredPlayers(players);



function updateSpecificTable(type, filteredPlayers, isAdmin) {
    const tableBody = document.getElementById(`playerTableBody${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!tableBody) return;

    tableBody.innerHTML = '';

    filteredPlayers.forEach(player => {
        if (!player[`${type}GamesWon`]) player[`${type}GamesWon`] = 0;
        if (!player[`${type}TotalGames`]) player[`${type}TotalGames`] = 0;
        if (!player[`${type}WinPercentage`]) player[`${type}WinPercentage`] = 0;
    });

    filteredPlayers.sort((a, b) => {
        const gamesWonA = a[`${type}GamesWon`];
        const gamesWonB = b[`${type}GamesWon`];
        if (gamesWonB !== gamesWonA) {
            return gamesWonB - gamesWonA;
        }
        return b[`${type}TotalGames`] - a[`${type}TotalGames`];
    });

    filteredPlayers.forEach((player, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        const nameCell = document.createElement('td');
        const profileLink = document.createElement('a');
        profileLink.href = `profile.html?player=${player.name.replace(/\s+/g, '-').toLowerCase()}`;
        profileLink.textContent = player.name;
        nameCell.appendChild(profileLink);
        row.appendChild(nameCell);

        const totalGamesCell = document.createElement('td');
        totalGamesCell.textContent = player[`${type}TotalGames`];
        row.appendChild(totalGamesCell);

        const gamesWonCell = document.createElement('td');
        gamesWonCell.textContent = player[`${type}GamesWon`];
        row.appendChild(gamesWonCell);

        const winPercentageCell = document.createElement('td');
        winPercentageCell.textContent = player[`${type}WinPercentage`] + '%';
        row.appendChild(winPercentageCell);

        if (isAdmin) {
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deletePlayer(player.name);
            });
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
        }

        tableBody.appendChild(row);
    });
}

document.getElementById('addPlayerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addPlayer();
});

document.getElementById('editPlayerSelect').addEventListener('change', function () {
    loadPlayerMatchesForEdit();
});

function populatePlayerSuggestions() {
    // This function is already implemented and populates the datalist
    // However, with the new approach, we'll be dynamically creating dropdowns instead of using a datalist
}


function loadTournaments(playerName) {
    const tournamentsContainer = document.getElementById('tournamentList');
    tournamentsContainer.innerHTML = '';

    const tournaments = playerTournaments[playerName] || [];

    if (tournaments.length === 0) {
        tournamentsContainer.innerHTML = '<p>No tournaments played yet.</p>';
        return;
    }

    tournaments.forEach(tournament => {
        const tournamentElement = document.createElement('div');
        tournamentElement.innerHTML = `
            <p><strong>${tournament.name}</strong> at ${tournament.location} on ${tournament.date}</p>
        `;
        tournamentsContainer.appendChild(tournamentElement);
    });
}

// Call loadTournaments in the appropriate place
loadTournaments(player.name);

// Function to recalculate player statistics
function recalculatePlayerStatistics(playerName) {
    const playerMatches = playerGames[playerName.toLowerCase()] || [];
    const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());

    if (!player) {
        console.error('Player not found.');
        return;
    }

    let totalGames = 0;
    let gamesWon = 0;

    // Calculate total games and wins
    playerMatches.forEach(match => {
        totalGames++;
        const team1Wins = match.team1[0].scores.reduce((a, b) => a + b, 0) > match.team2[0].scores.reduce((a, b) => a + b, 0);
        const playerInTeam1 = match.team1.some(p => p.name.toLowerCase() === playerName.toLowerCase());

        if ((team1Wins && playerInTeam1) || (!team1Wins && !playerInTeam1)) {
            gamesWon++;
        }
    });

    // Update the player's stats
    player.totalGames = totalGames;
    player.gamesWon = gamesWon;
    player.winPercentage = totalGames > 0 ? ((gamesWon / totalGames) * 100).toFixed(2) : 0;

    // Save the updated player back to localStorage
    localStorage.setItem('players', JSON.stringify(players));
}

// No Lowercase Conversion: Handle forms without converting to lowercase
document.getElementById('gameForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const playerName = document.getElementById('editPlayerSelect').value.trim();
    const matchIndex = parseInt(document.getElementById('matchIndex').value);

    const updatedMatch = {
        round: document.getElementById('round').value,
        team1: [
            { name: document.getElementById('team1Player1').value.trim(), scores: document.getElementById('team1Scores').value.split(',').map(Number) },
            { name: document.getElementById('team1Player2').value.trim(), scores: [] }
        ],
        team2: [
            { name: document.getElementById('team2Player1').value.trim(), scores: document.getElementById('team2Scores').value.split(',').map(Number) },
            { name: document.getElementById('team2Player2').value.trim(), scores: [] }
        ],
        date: document.getElementById('date').value,
        location: document.getElementById('location').value
    };

    editMatchAndRecalculate(playerName, matchIndex, updatedMatch);
    loadAdminLeagueMatches(playerName);  // Reload matches to reflect changes
});

// Call this function after the player profile is loaded
setupStatsTabs();
updateStatistics(player);

function setupGameDeletion(playerName) {
    document.querySelectorAll('.delete-game-button').forEach((button, index) => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this game?')) {
                deleteGame(playerName, index);
                loadProfile();  // Reload the profile to reflect the deleted game
            }
        });
    });
}


// Automatically open the first tab (Overview) on page load
document.addEventListener('DOMContentLoaded', function() {
    const defaultTab = document.querySelector('.tablink');
    if (defaultTab) {
        defaultTab.click();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const defaultTab = document.querySelector('.tablink');
    if (defaultTab) {
        openTab({ currentTarget: defaultTab }, 'Overview');
    }
});

function loadTab(tabName) {
    document.getElementById("tabContent").innerHTML = "";
    fetch(`${tabName}.html`).then(response => response.text())
        .then(html => document.getElementById("tabContent").innerHTML = html);
}
const totalGames = parseInt(document.getElementById('totalGamesText').textContent);
const gamesWon = parseInt(document.getElementById('gamesWonText').textContent);
const winPercentage = totalGames === 0 ? 0 : (gamesWon / totalGames) * 100;

document.getElementById('winPercentageText').textContent = `${winPercentage.toFixed(2)}%`;
document.querySelector('.progress').style.width = `${winPercentage}%`;

function updateExistingMatch(playerName, matchIndex, playerWin, teamIndex, team1Scores, team2Scores) {
    const player = players.find(p => p.name === playerName);
    const match = playerGames[playerName][matchIndex];

    const wasWin = match.result === 'win';

    if (wasWin !== playerWin) {
        if (playerWin) {
            player.gamesWon++;
        } else {
            player.gamesWon--;
        }

        match.result = playerWin ? 'win' : 'loss';
        player.winPercentage = Math.round((player.gamesWon / player.totalGames) * 100);
    }

    // Update the scores
    match.team1[0].scores = team1Scores;
    match.team1[1].scores = team1Scores;
    match.team2[0].scores = team2Scores;
    match.team2[1].scores = team2Scores;

    // Also update the other players in the match
    const otherPlayers = teamIndex === 0 ? match.team2 : match.team1;
    otherPlayers.forEach(p => {
        const otherPlayerMatchIndex = playerGames[p.name].findIndex(m => m.round === match.round && m.date === match.date && m.location === match.location);
        if (otherPlayerMatchIndex > -1) {
            playerGames[p.name][otherPlayerMatchIndex].team1[0].scores = team1Scores;
            playerGames[p.name][otherPlayerMatchIndex].team1[1].scores = team1Scores;
            playerGames[p.name][otherPlayerMatchIndex].team2[0].scores = team2Scores;
            playerGames[p.name][otherPlayerMatchIndex].team2[1].scores = team2Scores;
        }
    });
}

function updateExistingMatch(playerName, matchIndex, playerWin) {
    const player = players.find(p => p.name === playerName);
    const match = playerGames[playerName][matchIndex];

    const wasWin = match.result === 'win';

    if (wasWin !== playerWin) {
        if (playerWin) {
            player.gamesWon++;
        } else {
            player.gamesWon--;
        }

        match.result = playerWin ? 'win' : 'loss';
        player.winPercentage = Math.round((player.gamesWon / player.totalGames) * 100);
    }
}

function updatePlayerStatsForMatch({ team1Player1Name, team1Player2Name, team2Player1Name, team2Player2Name, team1TotalScore, team2TotalScore, isNewMatch }) {
    const playersToUpdate = [
        { name: team1Player1Name, teamIndex: 0 },
        { name: team1Player2Name, teamIndex: 0 },
        { name: team2Player1Name, teamIndex: 1 },
        { name: team2Player2Name, teamIndex: 1 }
    ];

    playersToUpdate.forEach(playerInfo => {
        const player = players.find(p => p.name === playerInfo.name);

        if (player) {
            if (isNewMatch) {
                // For new matches, increase total games for all players
                player.totalGames = (player.totalGames || 0) + 1;
            }

            // Determine if the player's team won
            const playerWon = (playerInfo.teamIndex === 0 && team1TotalScore > team2TotalScore) ||
                              (playerInfo.teamIndex === 1 && team2TotalScore > team1TotalScore);

            if (isNewMatch && playerWon) {
                player.gamesWon = (player.gamesWon || 0) + 1;
            } else if (!isNewMatch) {
                // Handle edits: adjust gamesWon if the outcome changed
                const originalMatch = playerGames[player.name].find(
                    m => m.date === matchToUpdate.date && m.location === matchToUpdate.location
                );
                const originalTeam1TotalScore = originalMatch.team1[0].scores.reduce((total, score) => total + score, 0);
                const originalTeam2TotalScore = originalMatch.team2[0].scores.reduce((total, score) => total + score, 0);
                const originalTeamWon = playerInfo.teamIndex === 0 ? originalTeam1TotalScore > originalTeam2TotalScore : originalTeam2TotalScore > originalTeam1TotalScore;

                if (originalTeamWon && !playerWon) {
                    player.gamesWon--;
                } else if (!originalTeamWon && playerWon) {
                    player.gamesWon++;
                }
            }

            // Recalculate win percentage
            player.winPercentage = player.totalGames > 0 ? Math.round((player.gamesWon / player.totalGames) * 100) : 0;
        }
    });
}

function addMatchToPlayer() {
    const selectedPlayerIndex = document.getElementById('editPlayerSelect').value;
    if (selectedPlayerIndex === '') {
        alert('Please select a player before adding a match.');
        return;
    }

    const players = JSON.parse(localStorage.getItem('players')) || [];
    const player = players[selectedPlayerIndex];

    // Create the new match object from the form input values
    const newMatch = {
        round: document.getElementById('round').value,
        team1Player1: document.getElementById('team1Player1').value,
        team1Player2: document.getElementById('team1Player2').value,
        team1Scores: document.getElementById('team1Scores').value,
        team2Player1: document.getElementById('team2Player1').value,
        team2Player2: document.getElementById('team2Player2').value,
        team2Scores: document.getElementById('team2Scores').value,
        date: document.getElementById('date').value,
        location: document.getElementById('location').value
    };

    // Ensure the player has a matches array
    if (!player.matches) {
        player.matches = [];
    }

    // Add the new match to the player's matches array
    player.matches.push(newMatch);

    // Save the updated players array back to localStorage
    localStorage.setItem('players', JSON.stringify(players));

    // Reload the matches for the selected player
    loadPlayerMatches(selectedPlayerIndex);

    // Clear the form after submission
    document.getElementById('leagueGameForm').reset();
}

function updateMatchInPlayerProfile(playerName, match, date, location, team1Player1Name, team1Player2Name, team1Scores, team2Player1Name, team2Player2Name, team2Scores) {
    const playerMatches = playerGames[playerName];
    if (playerMatches) {
        const matchToUpdate = playerMatches.find(m =>
            m.round === match.round &&
            m.date === match.date &&
            m.location === match.location
        );

        if (matchToUpdate) {
            matchToUpdate.date = date;
            matchToUpdate.location = location;
            matchToUpdate.team1[0].name = team1Player1Name;
            matchToUpdate.team1[1].name = team1Player2Name;
            matchToUpdate.team1[0].scores = team1Scores;
            matchToUpdate.team1[1].scores = team1Scores;
            matchToUpdate.team2[0].name = team2Player1Name;
            matchToUpdate.team2[1].name = team2Player2Name;
            matchToUpdate.team2[0].scores = team2Scores;
            matchToUpdate.team2[1].scores = team2Scores;
        }
    }
}

function updateWinsForMatch(playersInMatch, team1TotalScore, team2TotalScore) {
    playersInMatch.forEach(playerInfo => {
        const player = players.find(p => p.name === playerInfo.newName);

        if (player) {
            player.totalGames = player.totalGames ? player.totalGames + 1 : 1;

            // Determine if the player's team won
            const playerWon = (playerInfo.teamIndex === 0 && team1TotalScore > team2TotalScore) ||
                              (playerInfo.teamIndex === 1 && team2TotalScore > team1TotalScore);

            if (playerWon) {
                player.gamesWon = player.gamesWon ? player.gamesWon + 1 : 1;
            }

            // Recalculate win percentage
            player.winPercentage = player.totalGames > 0 ? Math.round((player.gamesWon / player.totalGames) * 100) : 0;
        }
    });
}

console.log(JSON.parse(localStorage.getItem('players')));

function filterPlayers(query) {
    const rows = document.querySelectorAll('#playerTableBodyTotal tr');
    rows.forEach(row => {
        const playerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        row.style.display = playerName.includes(query.toLowerCase()) ? '' : 'none';
    });
}

function setPlayerForm(player = null) {
    if (player) {
        document.getElementById('playerNameInput').value = player.name;
        document.getElementById('playerClubInput').value = player.club;
        // Update form behavior
    } else {
        document.getElementById('playerNameInput').value = '';
        document.getElementById('playerClubInput').value = '';
        // Add new player
    }
}

// Call setPlayerForm(playerObject) when editing a player, otherwise pass null for new player

function loadNav() {
    fetch('nav.html')
        .then(response => response.text())
        .then(data => document.getElementById("nav-placeholder").innerHTML = data);
}
let currentPage = 1;
const rowsPerPage = 10;
function displayTablePage(players) {
    const tableBody = document.getElementById("playersTableBody");
    tableBody.innerHTML = ""; // Clear table
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pagePlayers = players.slice(start, end);

    pagePlayers.forEach(player => {
        const row = `<tr><td>${player.name}</td><td>${player.club}</td></tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function nextPage(players) {
    if ((currentPage * rowsPerPage) < players.length) {
        currentPage++;
        displayTablePage(players);
    }
}

function prevPage(players) {
    if (currentPage > 1) {
        currentPage--;
        displayTablePage(players);
    }
}

// Dynamic Tab Loading
function loadTab(tabName) {
    document.getElementById("tabContent").innerHTML = "";
    fetch(`${tabName}.html`)
        .then(response => response.text())
        .then(html => document.getElementById("tabContent").innerHTML = html);
}

// Debounced Search for Ranking
let debounceTimeout;
function debouncedSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            filterPlayers(searchInput.value);
        }, 300);
    });
}

function filterPlayers(query) {
    const rows = document.querySelectorAll('#playerTableBodyTotal tr');
    rows.forEach(row => {
        const playerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        row.style.display = playerName.includes(query.toLowerCase()) ? '' : 'none';
    });
}

// Selectize for Admin Panel
function initializeSelectize() {
    $('#editPlayerSelect').selectize({
        create: false,
        sortField: 'text'
    });
}

// Progress Bar Calculation
function calculateProgress() {
    const totalGames = parseInt(document.getElementById('totalGamesText').textContent);
    const gamesWon = parseInt(document.getElementById('gamesWonText').textContent);
    const winPercentage = totalGames === 0 ? 0 : (gamesWon / totalGames) * 100;

    document.getElementById('winPercentageText').textContent = `${winPercentage.toFixed(2)}%`;
    document.querySelector('.progress').style.width = `${winPercentage}%`;
}


// Tournaments Array
let tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];

// Load Tournaments for Admin Panel
function loadTournamentsAdmin() {
    const tournamentsTableBody = document.getElementById('tournamentsTableBody');
    tournamentsTableBody.innerHTML = '';
    tournaments.forEach((tournament, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tournament.name}</td>
            <td>${tournament.location}</td>
            <td>${tournament.date}</td>
            <td>
                <button onclick="editTournament(${index})">Edit</button>
                <button onclick="deleteTournament(${index})">Delete</button>
            </td>
        `;
        tournamentsTableBody.appendChild(row);
    });
}

// Save New or Edited Tournament
function saveTournament(tournament, index = null) {
    if (index !== null) {
        tournaments[index] = tournament;
    } else {
        tournaments.push(tournament);
    }
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
    loadTournamentsAdmin();
}

// Add or Edit Tournament Handler
document.getElementById('saveTournamentButton').addEventListener('click', function () {
    const name = document.getElementById('tournamentName').value;
    const location = document.getElementById('tournamentLocation').value;
    const date = document.getElementById('tournamentDate').value;
    if (!name || !location || !date) return alert('Please fill in all fields');
    saveTournament({ name, location, date });
    loadTournaments(); // Update the tournaments display on tournaments.html
});

// Delete Tournament
function deleteTournament(index) {
    tournaments.splice(index, 1);
    localStorage.setItem('tournaments', JSON.stringify(tournaments));
    loadTournamentsAdmin();
}

// Load Tournaments on Page Load
document.addEventListener('DOMContentLoaded', function() {
    loadTournamentsAdmin();
    loadTournaments(); // Also call this on tournaments.html
});

function loadTournaments() {
    const tournamentsTableBody = document.getElementById('tournamentsTableBody');
    tournamentsTableBody.innerHTML = '';
    tournaments.forEach(tournament => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tournament.name}</td>
            <td>${tournament.location}</td>
            <td>${tournament.date}</td>
        `;
        tournamentsTableBody.appendChild(row);
    });
}
