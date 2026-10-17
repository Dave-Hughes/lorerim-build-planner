"""
Spike: renders one item's .nif (pulled by fetch.py) in Blender with the PyNifly add-on.

  blender --background --python scripts/renders/render.py -- <item dir> <out dir> [engine]

<item dir> is fetch.py's folder for the item (meshes\\ and textures\\ side by side, where PyNifly
looks for textures). Writes <out>/still.png (512 px) and <out>/turn/0000-0023.png (the turntable,
256 px), transparent background, a fixed three-quarter view and soft light from the top left.
engine: EEVEE (default) or CYCLES.
"""
import glob
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector

args = sys.argv[sys.argv.index("--") + 1:]
ITEM, OUT = os.path.abspath(args[0]), os.path.abspath(args[1])
ENGINE = (args[2] if len(args) > 2 else "EEVEE").upper()
FRAMES = 24
# Three-quarter view: camera 35 degrees round from the front, 20 degrees above.
AZIMUTH, ELEVATION = math.radians(35), math.radians(20)


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.preferences.addon_enable(module="io_scene_nifly")


def load():
    nif = glob.glob(os.path.join(ITEM, "meshes", "**", "*.nif"), recursive=True)[0]
    # PyNifly finds textures under its Skyrim texture path; the item's folder is a small Data folder.
    bpy.context.preferences.addons["io_scene_nifly"].preferences.sky_texture_path_1 = ITEM
    bpy.ops.import_scene.pynifly(filepath=nif, import_collisions=False, import_animations=False, import_tris=False, import_shapekeys=False)
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    # Effect shapes (Dawnbreaker's glow, blood decals) have no diffuse texture to show, and a sword's
    # scabbard (Scb) only shows when it's worn; hide them.
    keep = []
    for o in meshes:
        mat = o.active_material
        names = {n.image.filepath.lower() for n in mat.node_tree.nodes if n.type == "TEX_IMAGE" and n.image} if mat and mat.use_nodes else set()
        if o.name.lower().startswith("scb") or any("scabbard" in n for n in names):
            o.hide_render = True
        elif any("blood" in n or "effects" in n for n in names) and not any("weapons" in n or "armor" in n for n in names):
            o.hide_render = True
        else:
            keep.append(o)
    return nif, keep


def inventory_rotation():
    """
    The game's inventory view (BSInvMarker, a camera PyNifly imports) as a rotation that shows the
    model to our front camera as the inventory does: inventory camera space (x right, y up, looking
    down -z) onto ours (x right, z up, looking along +y). None when the NIF has no marker.
    """
    inv = next((o for o in bpy.context.scene.objects if o.name.startswith("BSInvMarker")), None)
    if not inv:
        return None
    to_front = Matrix.Rotation(math.radians(90), 4, "X")
    return to_front @ inv.matrix_world.to_quaternion().to_matrix().to_4x4().inverted()


def frame(meshes):
    """
    Parent the meshes to a pivot at their centre, turned as the inventory shows them (or, with no
    inventory marker, long items stood upright), and scale to fit a unit box.
    """
    inv = inventory_rotation()
    if inv:
        for o in meshes:
            o.matrix_world = inv @ o.matrix_world
        bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    size, centre = hi - lo, (hi + lo) / 2
    pivot = bpy.data.objects.new("pivot", None)
    bpy.context.scene.collection.objects.link(pivot)
    turn = bpy.data.objects.new("turn", None)
    bpy.context.scene.collection.objects.link(turn)
    turn.parent = pivot
    for o in meshes:
        o.matrix_world = Matrix.Translation(-centre) @ o.matrix_world
        o.parent = turn
    # A weapon lies along its longest axis; turn that axis to Z so it stands.
    long_axis = max(range(3), key=lambda i: size[i])
    if inv:
        pass
    elif long_axis == 0:
        turn.rotation_euler = (0, math.radians(90), 0)
    elif long_axis == 1:
        turn.rotation_euler = (math.radians(-90), 0, 0)
    pivot.scale = [1.0 / max(size)] * 3
    return pivot


def stage():
    scene = bpy.context.scene
    dist = 3.2
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    cam.data.lens = 85
    cam.location = (dist * math.cos(ELEVATION) * math.sin(AZIMUTH), -dist * math.cos(ELEVATION) * math.cos(AZIMUTH), dist * math.sin(ELEVATION))
    cam.rotation_euler = (Vector((0, 0, 0)) - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(cam)
    scene.camera = cam
    # Soft key light from the top left (as the camera sees it), a dim fill and rim, and a grey world.
    def area(name, loc, energy, size):
        light = bpy.data.objects.new(name, bpy.data.lights.new(name, "AREA"))
        light.data.energy, light.data.size = energy, size
        light.location = loc
        light.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        scene.collection.objects.link(light)
    left = Vector((-math.cos(AZIMUTH), -math.sin(AZIMUTH), 0))
    area("key", tuple(left * 2.2 + Vector((0, -1.2, 2.4))), 220, 2.5)
    area("fill", tuple(-left * 2.5 + Vector((0, -1.5, 0.3))), 40, 3)
    area("rim", (0.5, 2.5, 1.5), 80, 2)
    world = bpy.data.worlds.new("world")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.35, 0.35, 0.37, 1)
    world.node_tree.nodes["Background"].inputs[1].default_value = 0.6
    scene.world = world
    scene.render.engine = "CYCLES" if ENGINE == "CYCLES" else "BLENDER_EEVEE_NEXT"
    if ENGINE == "CYCLES":
        scene.cycles.samples = 64
        scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "AgX"


def render(pivot):
    scene = bpy.context.scene
    turn = pivot.children[0]
    scene.render.resolution_x = scene.render.resolution_y = 512
    scene.render.filepath = os.path.join(OUT, "still.png")
    bpy.ops.render.render(write_still=True)
    scene.render.resolution_x = scene.render.resolution_y = 256
    base = turn.rotation_euler.copy()
    for i in range(FRAMES):
        pivot.rotation_euler = (0, 0, 2 * math.pi * i / FRAMES)
        turn.rotation_euler = base
        scene.render.filepath = os.path.join(OUT, "turn", f"{i:04d}.png")
        bpy.ops.render.render(write_still=True)


clear()
nif, meshes = load()
print("RENDER", os.path.basename(nif), len(meshes), "meshes:", ", ".join(o.name for o in meshes))
stage()
render(frame(meshes))
