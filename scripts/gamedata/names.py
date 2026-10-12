"""Names the planner shows, from the game's own records."""
import re


def deity_name(tenets_name):
    """A Wintersun deity's name, from its tenets record: 'Tenets of the All-Maker' -> 'The All-Maker'."""
    name = re.sub(r"^Tenets of ", "", tenets_name.strip())
    return re.sub(r"^the ", "The ", name)
