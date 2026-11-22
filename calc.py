import random


def random_number(min_val, max_val):
    return random.randint(min_val, max_val)


if __name__ == "__main__":
    print(random_number(1, 100))
