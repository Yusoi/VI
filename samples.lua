lerp = function(a,b,f)
    return a + f * (b - a)
end

normalize = function(x,y,z)
    div = math.sqrt(x^2+y^2+z^2)
    return x/div,y/div,z/div
end

sample_generation = function()
    math.randomseed(os.time())
    samples = {}
    for i=1,64,1 do
        [[Creates each sample]]
        samples[i] = {}
        samples[i][1] = math.random()*2.0 - 1.0
        samples[i][2] = math.random()*2.0 - 1.0
        samples[i][3] = math.random()

        [[Normalizes vector]]
        samples[i][1],samples[i][2],samples[i][3] = normalize(samples[i][1],samples[i][2],samples[i][3])

        [[Adds another layer of randomization]]
        samples[i][1],samples[i][2],samples[i][3] = samples[i][1]*math.random(),samples[i][2]*math.random(),samples[i][3]*math.random()

        [[Creates scale variable and applies lerp to it]]
        scale = i/64
        scale = lerp(0.1,1.0,scale^2)
        samples[i][1],samples[i][2],samples[i][3] = samples[i][1]*scale,samples[i][2]*scale,samples[i][3]*scale
    end

    return samples
end

noise_generation = function()
    math.randomseed(os.time())
    noise = {}
    for i=1,4,1 do
        noise[i] = {}
        for j=1,4,1 do
            noise[i][j] = {}
            noise[i][j][1] = math.random()*2.0 - 1.0
            noise[i][j][2] = math.random()*2.0 - 1.0
            noise[i][j][3] = 0.0
        end
    end

    return noise
end


