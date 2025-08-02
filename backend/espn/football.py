from espn_api.football import League

class FantasyFootball:
    def __init__(self, league_id, year, espn_s2, swid):
        self.league = League(league_id=league_id, year=year, espn_s2=espn_s2, swid=swid)
        self.teams = self.league.teams
        self.standings = self.league.standings()
        self.matchups = self.league.matchups()

    def get_team(self, team_name):
        return next((team for team in self.league.teams if team.team_name == team_name), None)
    
    def get_player_info(self, player_id):
        return self.league.player_info(player_id)
    
    def get_power_rankings(self, week=None):
        return self.league.power_rankings(week=week)
    
    def get_power_rankings_v2(self):
        return None

class FantasyFootballTeam:
    def __init__(self, team_name, league):
        self.team_name = team_name
        self.league = league
        self.team = self.league.get_team(team_name)
        self.roster = self.team.roster
        self.players = self.roster.players
        self.player_ids = [player.player_id for player in self.players]

    