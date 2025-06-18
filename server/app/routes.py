import os
from flask import Blueprint, request, jsonify, current_app

engine=Blueprint('engine',__name__)

@engine.route('/')
def sendmodel(model):
    return model.getModel()

